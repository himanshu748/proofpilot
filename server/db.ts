import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { randomUUID } from "node:crypto";
import { auditEvents, documents, extractedFields, type InsertUser, users } from "../drizzle/schema";
import { type ProofField } from "./proofpilot";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: values.lastSignedIn };
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  updateSet.role = values.role;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export type NewProofDocument = {
  ownerId: number;
  fileName: string;
  storageKey: string;
  storageUrl: string;
  fields: ProofField[];
  confidenceScore: number;
  status: "pending review" | "approved" | "rejected";
  extractionRequestId?: string;
  providerMessage: string;
};

export async function createProofDocument(input: NewProofDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const documentId = randomUUID();
  await db.insert(documents).values({
    id: documentId,
    ownerId: input.ownerId,
    fileName: input.fileName,
    storageKey: input.storageKey,
    storageUrl: input.storageUrl,
    confidenceScore: input.confidenceScore.toFixed(4),
    status: input.status,
    extractionRequestId: input.extractionRequestId ?? null,
  });
  if (input.fields.length) {
    await db.insert(extractedFields).values(input.fields.map(field => ({
      id: randomUUID(),
      documentId,
      fieldKey: field.key,
      label: field.label,
      value: field.value,
      confidence: field.confidence.toFixed(4),
      sourcePage: field.page,
      sourceCitation: field.citation,
      sourceBounds: field.bounds ? JSON.stringify(field.bounds) : null,
      requiresReview: field.confidence < 0.86,
    })));
  }
  await recordAudit(documentId, input.ownerId, "document.uploaded", "A PDF source document was stored in ProofPilot.", { fileName: input.fileName, storageKey: input.storageKey });
  await recordAudit(documentId, input.ownerId, "nutrient.extraction.completed", input.providerMessage, { requestId: input.extractionRequestId ?? null });
  return getProofDocument(documentId);
}

export async function getProofDocument(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const [document] = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  if (!document) return undefined;
  const fields = await db.select().from(extractedFields).where(eq(extractedFields.documentId, id));
  const audit = await db.select().from(auditEvents).where(eq(auditEvents.documentId, id)).orderBy(desc(auditEvents.createdAt));
  return { document, fields, audit };
}

export async function listProofDocuments(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(documents).where(eq(documents.ownerId, ownerId)).orderBy(desc(documents.updatedAt));
}

export async function updateProofField(fieldId: string, value: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.update(extractedFields).set({ value, editedByHuman: true, reviewedAt: new Date() }).where(eq(extractedFields.id, fieldId));
}

export async function updateProofDocumentStatus(
  documentId: string,
  status: "pending review" | "approved" | "rejected",
  updates: { signedStorageKey?: string; signedStorageUrl?: string; signingRequestId?: string; finalizedAt?: Date } = {},
) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.update(documents).set({ status, ...updates }).where(eq(documents.id, documentId));
}

export async function recordAudit(documentId: string, actorId: number | null, eventType: string, message: string, metadata?: unknown) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.insert(auditEvents).values({
    id: randomUUID(),
    documentId,
    actorId,
    eventType,
    message,
    metadata: metadata ? JSON.stringify(metadata) : null,
  });
}
