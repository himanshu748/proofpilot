# ProofPilot Integration Notes

## Nutrient DWS

 ProofPilot calls Nutrient DWS Data Extraction at `POST https://api.nutrient.io/extraction/parse`, authenticated with a bearer API key. The documented multipart request includes a `file` and, optionally, `instructions={"mode":"understand","output":{"format":"spatial"}}`. Spatial output includes detection confidence, source bounds, and page information. The reviewed output retains this source-grounded metadata and routes low-confidence values to human review.

The finalization adapter uses the DWS Processor `POST https://api.nutrient.io/sign` endpoint with a bearer token and a multipart `file` field. Nutrient documents that this operation applies a cryptographic signature over the signed PDF byte range and includes a timestamp and B-LT validation material. ProofPilot persists the signed artifact location, signing request identifier when returned, finalization timestamp, and audit event. The application presents this accurately as tamper-evident document integrity and organization-account attribution rather than a claim of individual legal consent.

The required runtime configuration is deliberately server-side only: `NUTRIENT_DWS_API_KEY` for Data Extraction, `NUTRIENT_DWS_PROCESSOR_API_KEY` for Processor signing, `NUTRIENT_DWS_DATA_EXTRACTION_URL`, and `NUTRIENT_DWS_PROCESSOR_URL`. Until the account credentials and final endpoints are supplied, the user experience will use a clearly labelled local demonstration adapter, never a fabricated claim of a completed external signing operation.

On August 17, 2026, the user-authorized Nutrient dashboard showed the Data Extraction API as active with **5,000 of 5,000** free credits remaining for the August 17–September 17 period. The API-key management route shown by the dashboard is `https://dashboard.nutrient.io/data-extraction-api/api_keys/`. This supports a live non-sensitive validation once the key is entered through the secure project-secret flow.

The configured Data Extraction credential was live-validated on August 17, 2026 against the synthetic `proofpilot-northstar-sample-invoice.pdf`. The request authenticated successfully, completed through the Nutrient extraction endpoint, returned at least one extracted field, and passed the dedicated `server/nutrient.live.test.ts` validation. Processor/signing access must be validated separately because the dashboard exposes Processor API configuration as a distinct product.

On the same date, the authenticated Processor API dashboard showed a separate live key with 50 of 50 free credits available for the August 17–September 17 period. ProofPilot therefore keeps this credential separate and will not attempt a signing request until the key is securely configured.

The Processor credential was live-validated on August 17, 2026 with the same synthetic sample invoice. The signing request authenticated, returned a PDF artifact, and passed `server/nutrient.processor.live.test.ts`. This validates the two required live sponsor operations independently: Data Extraction for confidence-scored document content and Processor for the signed output artifact.

The strengthened live signing test verifies both a valid PDF artifact and a `/ByteRange` marker inside the returned PDF. ProofPilot now records this `byteRangeMarkerPresent` signing-evidence value alongside the provider request identifier and response content type in the `nutrient.signing.completed` audit metadata.

The external-service tests are intentionally opt-in: `pnpm test` runs only non-billing regression checks, while `pnpm test:live` runs `*.live.test.ts` with `RUN_LIVE_INTEGRATION_TESTS=true`. This prevents normal local or CI checks from consuming API credits. On August 17, 2026, a later repeat of the live Processor test correctly received a `402` response because that separate free-credit balance had been exhausted; it does not invalidate the earlier successful signing validation or its `/ByteRange` evidence.

## Shipaton Repository Inspection

The selected `himanshu748/himanshu-portfolio` repository is a Vite/React portfolio archive rather than a Shipaton app or game. It contains no Shipaton build to import or continue, so ProofPilot is being created as an independent project.
