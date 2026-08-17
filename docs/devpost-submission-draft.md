# ProofPilot — Devpost Submission Draft

## Project name

ProofPilot

## One-line summary

From messy PDF to a decision you can defend.

## Inspiration

Document AI is most useful when it does more than produce an answer. In invoice processing, onboarding, compliance, and operations, a plausible extraction is not enough: teams need to know what came from the source, how certain the system was, who corrected it, and what exactly was approved. ProofPilot was built around that accountable path.

## What it does

ProofPilot is an end-to-end PDF document-processing workspace. It stores an uploaded source PDF, sends it through Nutrient DWS Data Extraction, retains confidence and source-location metadata for extracted values, and sends uncertain fields to a human-review gate. Every upload, extraction, correction, rejection, approval, and finalization event is timestamped in the audit record. After review, the finalization adapter sends the reviewed document to Nutrient DWS Processor for a tamper-evident signed output artifact.

The public demo uses a synthetic one-page invoice with an intentionally ambiguous payment-terms field. This makes the important product behavior immediately visible: ProofPilot pauses rather than silently accepting an uncertain answer.

## How it was built

The application uses React, TypeScript, Tailwind, tRPC, an Express server, a relational database, and S3-backed storage. Nutrient DWS Data Extraction is called server-side with a document-in/multipart request and spatial extraction instructions. The app records confidence, page, bounds, and citation metadata per extracted field. The signing flow uses Nutrient DWS Processor’s document-in/document-out signing endpoint, stores the final artifact separately, and records the finalization request in the audit ledger.

The build intentionally separates public demo data from private uploads. The judge-facing route only exposes a synthetic PDF and does not expose a user-uploaded document.

## Challenges encountered

The key design challenge was making the product honest about uncertainty. A demo that only shows high-confidence happy paths would hide the value of the review layer. We built the sample experience around a low-confidence field, created an explicit review gate, and made the interface show why a human intervention is required.

## Accomplishments

- A polished multi-route workflow for dashboard, review, public demo, and submission evidence.
- S3-backed source and final-artifact storage paths.
- Per-field confidence scores, citations, and review markers.
- Required status language: `pending review`, `approved`, and `rejected`.
- Timestamped, persistent audit records for workflow actions.
- An inspectable public sample PDF and judge-focused architecture diagram.

## What’s next

The immediate next step is to configure a live Nutrient DWS key, validate the source PDF against both the extraction and signing endpoints, and record the 90–120 second public walkthrough. Longer term, ProofPilot can add policy-specific extraction schemas and more advanced exception routing while keeping review decisions auditable.

## Built with

React, TypeScript, Tailwind CSS, tRPC, Express, Drizzle ORM, MySQL/TiDB, S3 storage, Nutrient DWS Data Extraction API, Nutrient DWS Processor API.

## Sponsor statement — Nutrient DWS

ProofPilot uses Nutrient DWS for the core product workflow, not a peripheral demonstration: Data Extraction provides confidence-scored spatial elements for human review, while Processor signing is the final tamper-evident artifact step. Do not claim live provider execution until the configured key has been validated and captured in the demo video.
