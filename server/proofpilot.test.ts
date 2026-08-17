import { describe, expect, it } from "vitest";
import { averageConfidence, buildDemoAudit, classifyStatus, demoFields, needsHumanReview, normalizeConfidence } from "./proofpilot";

describe("ProofPilot confidence and workflow utilities", () => {
  it("normalizes confidence values to the valid zero-to-one range", () => {
    expect(normalizeConfidence(1.5)).toBe(1);
    expect(normalizeConfidence(-2)).toBe(0);
    expect(normalizeConfidence("0.74")).toBe(0.74);
  });

  it("routes low-confidence extractions to human review", () => {
    expect(needsHumanReview(0.72)).toBe(true);
    expect(needsHumanReview(0.96)).toBe(false);
    expect(classifyStatus(demoFields)).toBe("pending review");
  });

  it("calculates an explainable mean confidence", () => {
    expect(averageConfidence([{ confidence: 0.8 }, { confidence: 1 }])).toBeCloseTo(0.9);
  });

  it("uses only the required workflow status labels", () => {
    expect(classifyStatus([{ confidence: 0.9 }])).toBe("approved");
    expect(classifyStatus([{ confidence: 0.85 }])).toBe("pending review");
  });

  it("creates timestamped demo audit records for the document workflow", () => {
    const audit = buildDemoAudit();
    expect(audit).toHaveLength(3);
    expect(audit.every(event => !Number.isNaN(Date.parse(event.at)))).toBe(true);
    expect(audit.map(event => event.eventType)).toContain("nutrient.extraction.completed");
  });
});
