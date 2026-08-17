# ProofPilot Sponsor-Track Strategy

ProofPilot’s primary entry is the **Nutrient DWS Challenge**. Nutrient drives the workflow’s two non-negotiable operations: confidence-scored extraction from source PDFs and cryptographic finalization of the reviewer-approved artifact. The interface will visibly show field citations, reviewer interventions, audit events, and final tamper-evidence metadata.

The project can credibly extend to two additional compatible categories once the relevant sponsor credentials are provided. **SerpApi** supports a “Trust research” step: the reviewer can retrieve current structured sources for an issuer, regulatory requirement, or policy referenced by the document, then save that source as auditable supporting evidence. The implemented request sends only an extracted issuer name plus generic public-policy terms—not the source PDF or its sensitive line items—and records the query plus returned public results in the ProofPilot audit ledger. **Doctavian** will generate a signed-ready review certificate from the approved document’s structured data and audit history, making the approval outcome reusable as a governed document rather than a static interface state.

**name.com** is technically compatible only as a branded public-review portal feature: the share workflow can search a custom review-portal domain and use configured DNS for a trusted public demo hostname. It will be included only if a real API key and legitimate domain workflow are available, because the category requires the API to be functionally central rather than decorative.

The current build will not claim eligibility for Perfect Corp, Xano, Foxit, Apptio, useBruno, or Wundergraph. Perfect Corp is consumer/retail-specific; Xano requires that it meaningfully power the backend; and the remaining categories have no published implementation requirements yet. Adding them without a real use would weaken the demo and fail the sponsors’ requirement that an integration be substantive.

## Evidence in the submission

The submission page will name every enabled sponsor integration, show the exact ProofPilot screen where it is used, and link each integration to the relevant recorded audit event. Disabled integration cards will explain the required credential and will never pretend that an external API was called.
