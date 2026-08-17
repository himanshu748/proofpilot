export type IssuerResearchFinding = {
  title: string;
  link: string;
  snippet: string;
  displayedLink?: string;
};

export type IssuerResearchResult = {
  issuer: string;
  query: string;
  findings: IssuerResearchFinding[];
  providerMessage: string;
};

export function normalizeIssuer(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 180);
}

export async function researchIssuerWithSerpApi(issuerValue: string): Promise<IssuerResearchResult> {
  const issuer = normalizeIssuer(issuerValue);
  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) throw new Error("SERPAPI_API_KEY is not configured.");
  if (!issuer) throw new Error("An extracted issuer name is required for evidence research.");

  const query = `${issuer} official website policies`;
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", query);
  url.searchParams.set("api_key", apiKey);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`SerpApi issuer research failed (${response.status}): ${await response.text()}`);
  const payload = await response.json() as {
    organic_results?: Array<{ title?: string; link?: string; snippet?: string; displayed_link?: string }>;
  };
  const findings = (payload.organic_results ?? [])
    .filter(result => result.title && result.link)
    .slice(0, 4)
    .map(result => ({
      title: result.title!,
      link: result.link!,
      snippet: result.snippet ?? "No summary returned by the research provider.",
      displayedLink: result.displayed_link,
    }));
  return {
    issuer,
    query,
    findings,
    providerMessage: `SerpApi returned ${findings.length} public issuer and policy research results for reviewer inspection.`,
  };
}
