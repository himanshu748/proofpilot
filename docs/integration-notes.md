# ProofPilot Integration Notes

## Nutrient DWS

 ProofPilot calls Nutrient DWS Data Extraction at `POST https://api.nutrient.io/extraction/parse`, authenticated with a bearer API key. The documented multipart request includes a `file` and, optionally, `instructions={"mode":"understand","output":{"format":"spatial"}}`. Spatial output includes detection confidence, source bounds, and page information. The reviewed output retains this source-grounded metadata and routes low-confidence values to human review.

The finalization adapter uses the DWS Processor `POST https://api.nutrient.io/sign` endpoint with a bearer token and a multipart `file` field. Nutrient documents that this operation applies a cryptographic signature over the signed PDF byte range and includes a timestamp and B-LT validation material. ProofPilot persists the signed artifact location, signing request identifier when returned, finalization timestamp, and audit event. The application presents this accurately as tamper-evident document integrity and organization-account attribution rather than a claim of individual legal consent.

The required runtime configuration is deliberately server-side only: `NUTRIENT_DWS_API_KEY`, `NUTRIENT_DWS_DATA_EXTRACTION_URL`, and `NUTRIENT_DWS_PROCESSOR_URL`. Until the account credentials and final endpoints are supplied, the user experience will use a clearly labelled local demonstration adapter, never a fabricated claim of a completed external signing operation.

## Shipaton Repository Inspection

The selected `himanshu748/himanshu-portfolio` repository is a Vite/React portfolio archive rather than a Shipaton app or game. It contains no Shipaton build to import or continue, so ProofPilot is being created as an independent project.
