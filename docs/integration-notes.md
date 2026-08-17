# ProofPilot Integration Notes

## Nutrient DWS

 ProofPilot will call Nutrient DWS Data Extraction for schema-shaped fields, per-field citations, and confidence scores. Nutrient documents the parse endpoint at `https://api.nutrient.io/extraction/parse`, authenticated with a bearer API key; its spatial output includes detection confidence, source bounds, and page information. The reviewed output will retain source-grounded field metadata and route low-confidence values to human review.

The finalization adapter will use the DWS Processor `https://api.nutrient.io/sign` endpoint. Nutrient documents that this operation applies a cryptographic signature over the signed PDF byte range and includes a timestamp and B-LT validation material. ProofPilot will persist the signed artifact location, signing request identifier when returned, finalization timestamp, and the audit event. The application will present this accurately as tamper-evident document integrity and organization-account attribution rather than a claim of individual legal consent.

The required runtime configuration is deliberately server-side only: `NUTRIENT_DWS_API_KEY`, `NUTRIENT_DWS_DATA_EXTRACTION_URL`, and `NUTRIENT_DWS_PROCESSOR_URL`. Until the account credentials and final endpoints are supplied, the user experience will use a clearly labelled local demonstration adapter, never a fabricated claim of a completed external signing operation.

## Shipaton Repository Inspection

The selected `himanshu748/himanshu-portfolio` repository is a Vite/React portfolio archive rather than a Shipaton app or game. It contains no Shipaton build to import or continue, so ProofPilot is being created as an independent project.
