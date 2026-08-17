import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { extractWithNutrient } from "./nutrient";

describe("Nutrient DWS live credential", () => {
  it("authenticates one non-sensitive sample PDF extraction", async () => {
    expect(process.env.NUTRIENT_DWS_API_KEY).toBeTruthy();
    const samplePdf = await readFile("/home/ubuntu/webdev-static-assets/proofpilot-northstar-sample-invoice.pdf");
    const result = await extractWithNutrient(samplePdf, "proofpilot-northstar-sample-invoice.pdf");

    expect(result.usedLiveApi).toBe(true);
    expect(result.fields.length).toBeGreaterThan(0);
  }, 30_000);
});
