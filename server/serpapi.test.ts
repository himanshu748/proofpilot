import { describe, expect, it } from "vitest";
import { buildIssuerResearchQuery, normalizeIssuer, normalizeReviewFocus } from "./serpapi";

describe("issuer research helpers", () => {
  it("normalizes a bounded issuer query without changing its words", () => {
    expect(normalizeIssuer("  Northstar\n Field   Services Ltd. ")).toBe("Northstar Field Services Ltd.");
  });

  it("limits an issuer query to a safe public-search length", () => {
    expect(normalizeIssuer("a".repeat(250))).toHaveLength(180);
  });

  it("ties live issuer research to the open review topic without sending the field value", () => {
    expect(buildIssuerResearchQuery("Northstar Field Services Ltd.", "Payment terms"))
      .toBe("Northstar Field Services Ltd. official Payment terms policy");
    expect(normalizeReviewFocus("Payment terms: Net 30")).toBe("Payment terms Net 30");
  });
});
