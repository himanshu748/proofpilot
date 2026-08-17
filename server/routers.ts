import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createProofDocument, getProofDocument, listProofDocuments, recordAudit, updateProofDocumentStatus, updateProofField } from "./db";
import { extractWithNutrient, signWithNutrient } from "./nutrient";
import { averageConfidence, buildDemoAudit, classifyStatus, demoFields } from "./proofpilot";
import { researchIssuerWithSerpApi } from "./serpapi";
import { storageGetSignedUrl, storagePut } from "./storage";

const documentIdInput = z.object({ documentId: z.string().uuid() });

async function getOwnedDocument(documentId: string, ownerId: number) {
  const record = await getProofDocument(documentId);
  if (!record || record.document.ownerId !== ownerId) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Document not found." });
  }
  return record;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  proofpilot: router({
    demo: publicProcedure.query(() => ({
      document: {
        id: "sample-invoice",
        fileName: "northstar-services-invoice.pdf",
        status: "pending review" as const,
        confidenceScore: averageConfidence(demoFields),
        provider: "Nutrient DWS",
      },
      fields: demoFields,
      audit: buildDemoAudit(),
      liveApiConfigured: Boolean(process.env.NUTRIENT_DWS_API_KEY),
    })),
    list: protectedProcedure.query(({ ctx }) => listProofDocuments(ctx.user.id)),
    get: protectedProcedure.input(documentIdInput).query(({ ctx, input }) => getOwnedDocument(input.documentId, ctx.user.id)),
    researchIssuer: protectedProcedure.input(documentIdInput).mutation(async ({ ctx, input }) => {
      const record = await getOwnedDocument(input.documentId, ctx.user.id);
      const issuerField = record.fields.find(field => /vendor|issuer|supplier|company/i.test(field.label) || /vendor|issuer|supplier|company/i.test(field.fieldKey));
      const research = await researchIssuerWithSerpApi(issuerField?.value ?? record.document.fileName.replace(/\.pdf$/i, ""));
      await recordAudit(input.documentId, ctx.user.id, "serpapi.issuer.research", research.providerMessage, {
        issuer: research.issuer,
        query: research.query,
        findings: research.findings,
      });
      return research;
    }),
    upload: protectedProcedure.input(z.object({
      fileName: z.string().min(1).max(255),
      contentBase64: z.string().min(1),
    })).mutation(async ({ ctx, input }) => {
      const bytes = Buffer.from(input.contentBase64, "base64");
      if (!bytes.subarray(0, 4).equals(Buffer.from("%PDF"))) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "ProofPilot accepts PDF documents only." });
      }
      if (bytes.byteLength > 10 * 1024 * 1024) {
        throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "PDFs must be 10 MB or smaller." });
      }
      const uploaded = await storagePut(`proofpilot/source/${ctx.user.id}/${input.fileName}`, bytes, "application/pdf");
      const extraction = await extractWithNutrient(bytes, input.fileName);
      const score = averageConfidence(extraction.fields);
      return createProofDocument({
        ownerId: ctx.user.id,
        fileName: input.fileName,
        storageKey: uploaded.key,
        storageUrl: uploaded.url,
        fields: extraction.fields,
        confidenceScore: score,
        status: classifyStatus(extraction.fields),
        extractionRequestId: extraction.requestId,
        providerMessage: extraction.providerMessage,
      });
    }),
    updateField: protectedProcedure.input(z.object({ documentId: z.string().uuid(), fieldId: z.string().uuid(), value: z.string().min(1).max(10000) }))
      .mutation(async ({ ctx, input }) => {
        await getOwnedDocument(input.documentId, ctx.user.id);
        await updateProofField(input.fieldId, input.value);
        await recordAudit(input.documentId, ctx.user.id, "review.field.updated", "A reviewer corrected an extracted value.", { fieldId: input.fieldId });
        return getProofDocument(input.documentId);
      }),
    reject: protectedProcedure.input(documentIdInput).mutation(async ({ ctx, input }) => {
      await getOwnedDocument(input.documentId, ctx.user.id);
      await updateProofDocumentStatus(input.documentId, "rejected");
      await recordAudit(input.documentId, ctx.user.id, "review.rejected", "The document was rejected after human review.");
      return getProofDocument(input.documentId);
    }),
    finalize: protectedProcedure.input(documentIdInput).mutation(async ({ ctx, input }) => {
      const record = await getOwnedDocument(input.documentId, ctx.user.id);
      const unresolvedFields = record.fields.filter(field => field.requiresReview && !field.reviewedAt);
      if (unresolvedFields.length) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Confirm every low-confidence field before finalization.",
        });
      }
      const sourceUrl = await storageGetSignedUrl(record.document.storageKey);
      const sourceResponse = await fetch(sourceUrl);
      if (!sourceResponse.ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to load the original PDF for finalization." });
      const signed = await signWithNutrient(Buffer.from(await sourceResponse.arrayBuffer()), record.document.fileName);
      const stored = await storagePut(`proofpilot/final/${ctx.user.id}/${record.document.fileName}`, signed.signedPdf, "application/pdf");
      await recordAudit(input.documentId, ctx.user.id, "review.approved", "The reviewer approved all extracted fields for finalization.");
      await updateProofDocumentStatus(input.documentId, "approved", {
        signedStorageKey: stored.key,
        signedStorageUrl: stored.url,
        signingRequestId: signed.requestId,
        finalizedAt: new Date(),
      });
      await recordAudit(input.documentId, ctx.user.id, "nutrient.signing.completed", signed.providerMessage, {
        requestId: signed.requestId,
        usedLiveApi: signed.usedLiveApi,
        signatureEvidence: signed.signatureEvidence ?? { byteRangeMarkerPresent: false, responseContentType: "demo" },
      });
      return getProofDocument(input.documentId);
    }),
  }),
});

export type AppRouter = typeof appRouter;
