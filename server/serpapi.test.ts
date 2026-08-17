import { describe, expect, it } from "vitest";
import { normalizeIssuer } from "./serpapi";

describe("issuer research helpers", () => {
  it("normalizes a bounded issuer query without changing its words", () => {
    expect(normalizeIssuer("  Northstar\n Field   Services Ltd. ")).toBe("Northstar Field Services Ltd.");
  });

  it("limits an issuer query to a safe public-search length", () => {
    expect(normalizeIssuer("a".repeat(250))).toHaveLength(180);
  });
});
