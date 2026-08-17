import { describe, expect, it } from "vitest";

describe("SerpApi live credential", () => {
  it("authenticates a lightweight issuer-research query", async () => {
    const apiKey = process.env.SERPAPI_API_KEY;
    expect(apiKey).toBeTruthy();
    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.set("engine", "google");
    url.searchParams.set("q", "Northstar Field Services official website");
    url.searchParams.set("api_key", apiKey!);
    const response = await fetch(url);
    expect(response.ok).toBe(true);
    const payload = await response.json() as { organic_results?: unknown[] };
    expect(Array.isArray(payload.organic_results)).toBe(true);
  }, 30_000);
});
