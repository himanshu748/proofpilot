import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { signWithNutrient } from "./nutrient";

describe("Nutrient Processor live credential", () => {
  it("authenticates a signing request for the non-sensitive ProofPilot sample PDF", async () => {
    expect(process.env.NUTRIENT_DWS_PROCESSOR_API_KEY).toBeTruthy();
    const samplePdf = await readFile("/home/ubuntu/webdev-static-assets/proofpilot-northstar-sample-invoice.pdf");
    const result = await signWithNutrient(samplePdf, "proofpilot-northstar-sample-invoice.pdf");

    expect(result.usedLiveApi).toBe(true);
    expect(result.signedPdf.subarray(0, 4).toString()).toBe("%PDF");
    expect(result.signedPdf.toString("latin1")).toContain("/ByteRange");
    expect(result.signatureEvidence?.byteRangeMarkerPresent).toBe(true);
  }, 30_000);
});
