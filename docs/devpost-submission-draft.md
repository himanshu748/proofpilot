# ProofPilot — Devpost Submission Draft

## Project name

ProofPilot

## One-line pitch

**From messy PDF to a decision you can defend.**

## Inspiration

Document AI can produce plausible answers, but an operations or compliance team still needs to know what came from the source, how uncertain it was, what public context was consulted, who made the final call, and whether the resulting record can be trusted. ProofPilot was built for that accountable path.

## What it does

ProofPilot is an evidence-first PDF review workspace for invoices and other operational documents. A user uploads a source PDF and **Nutrient DWS Data Extraction** turns it into confidence-scored, source-grounded fields. Low-confidence fields pause the workflow for a human reviewer instead of being silently accepted.

For an open exception, ProofPilot uses **SerpApi** to retrieve live public issuer research relevant to the review topic. The search uses the extracted issuer name and the field label—not the document text, identifiers, or reviewer-entered value. Returned sources are visible to the reviewer and the query, findings, and timestamp become part of the document’s audit trail. They provide context for a human decision; they are never presented as automatic identity or legal verification.

After all required human review is complete, ProofPilot uses **Nutrient DWS Processor** to create a tamper-evident final PDF record. The system retains the original source, extracted evidence, reviewer actions, research context, and finalization evidence together.

## Why Nutrient DWS does the heavy lifting

Nutrient DWS performs the two product-critical document operations: it extracts the confidence-scored evidence that determines whether a reviewer must intervene, and it produces the signed final artifact only after that review gate is satisfied. ProofPilot’s workflow would not be an accountable document decision system without those two DWS operations.

## Why SerpApi improves the AI experience

SerpApi turns an uncertain field into a better-informed human review. When an exception is open, ProofPilot retrieves live, structured public issuer context targeted to that review topic and preserves the results with the eventual decision. This makes research inspectable and attributable instead of forcing a reviewer to leave the workflow and search without a record.

## How it was built

The application uses React, TypeScript, Tailwind CSS, tRPC, Express, Drizzle ORM, MySQL/TiDB, and S3-backed storage. Nutrient calls are server-side only. Data Extraction returns the evidence used for confidence routing; the Processor finalization adapter stores its output separately and records signing metadata, including the inspectable PDF `/ByteRange` marker from the verified signing result. SerpApi calls Google Search with a bounded, public issuer-and-review-topic query and persists only the resulting public research metadata in the audit event.

## Challenges we ran into

The hard part was designing for uncertainty without pretending that a search result is proof. A low-confidence extraction must stay unresolved until a person corrects or confirms it. Likewise, public web research can add context but cannot replace verification. We made both boundaries explicit in the review interface, then recorded every action so a later reviewer can understand how the decision was made.

## Accomplishments

- Live-validated Nutrient Data Extraction against a non-sensitive synthetic invoice.
- Live-validated Nutrient Processor signing with a returned PDF that contains an inspectable `/ByteRange` signature marker.
- Authenticated end-to-end workflow verification: PDF upload, Nutrient extraction, live SerpApi issuer research, and a persisted audit event with four returned public findings.
- Human review gate for low-confidence fields, including explicit `pending review`, `approved`, and `rejected` states.
- S3-backed source and final-artifact storage references, with timestamped audit records for every workflow transition.
- Public judge demo that uses only a synthetic PDF and never exposes a private upload.

## What’s next

Before final submission, we will record the public 2–4 minute end-to-end demo and publish the project repository with the included setup instructions. The next product extension is policy-specific extraction schemas and stronger exception-routing rules, while keeping every researcher and reviewer action auditable.

## Built with

React, TypeScript, Tailwind CSS, tRPC, Express, Drizzle ORM, MySQL/TiDB, S3 storage, Nutrient DWS Data Extraction API, Nutrient DWS Processor API, and SerpApi.

## Demo storyboard (2 minutes 40 seconds)

Open with the source invoice and the problem: a plausible extraction is not an approval. Upload the synthetic PDF, then show Nutrient’s confidence-scored field evidence and source citations. Stop on the low-confidence payment-terms field, invoke SerpApi research for the issuer and review topic, and show the returned source cards. Confirm or correct the field, point to the persisted audit entries, then complete or explain the guarded Nutrient finalization step and close on the public synthetic demo page. The video should say explicitly that SerpApi provides reviewer context, not automatic verification.

## Sponsor statement — Nutrient DWS

ProofPilot uses Nutrient DWS for central document work rather than a peripheral call. Data Extraction creates the source-grounded, confidence-scored evidence that routes exceptions to human review. Processor signing creates the tamper-evident final artifact only after every required reviewer action has been resolved. The application has separately live-validated both operations against the same non-sensitive PDF, including a `/ByteRange` marker in the signed result.

## Sponsor statement — SerpApi

ProofPilot uses SerpApi to bring live public issuer context into the precise point where a human reviewer must resolve a document exception. The bounded query combines the extracted issuer name with the open review topic, returned sources are visible in the workspace, and the query and findings persist in the document audit trail. This makes research part of a defensible decision workflow without overstating what public search can verify.

## Official-entry check

The hackathon requires a public repository or shared link with setup instructions, a 2–4 minute end-to-end video, and a clear statement of DWS’s core role. The Nutrient and SerpApi track requirements and prize details were checked against the official challenge page on August 17, 2026. [1]

## References

[1]: https://api-cloud-ai-hackathon-2026.devpost.com/ "DevNetwork [API + Cloud + AI] Hackathon 2026 — official challenge page"
