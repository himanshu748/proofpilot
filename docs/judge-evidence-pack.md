# ProofPilot — Judge Evidence Pack

> **Purpose.** This is a fast, evidence-first guide for judges and reviewers. It maps the project’s central claims to a reproducible ProofPilot screen, source file, test, or recorded audit event. It deliberately distinguishes verified behavior from future work.

## How to Evaluate in Under Four Minutes

| Time | What to inspect | What it proves |
|---|---|---|
| 0:00–0:30 | Public synthetic demo: `/demo/sample-invoice` | The complete workflow, including the precise role of Nutrient DWS and SerpApi, without exposing a real user document. |
| 0:30–1:20 | Reviewer view: `/review/sample-invoice` | A low-confidence payment-term field is routed to a human, with source evidence and a finalization guardrail. |
| 1:20–2:00 | Private live review run | An authenticated synthetic upload can trigger a bounded SerpApi issuer-and-review-topic query; the results appear in the review workspace and audit trail. |
| 2:00–2:40 | Finalization evidence and repository tests | Nutrient DWS signing is guarded by reviewer approval; its prior live validation produced a PDF with a `/ByteRange` signature marker. |
| 2:40–3:00 | Audit timeline | Extraction, research, review, and finalization are timestamped rather than represented as an untraceable model output. |

## Claim-to-Evidence Matrix

| Competition claim | Inspectable evidence | Reproduction path | Accurate boundary |
|---|---|---|---|
| **Nutrient DWS Data Extraction is product-critical.** | The reviewer surface presents confidence per extracted field and sources; `server/nutrient.ts` calls the Extraction API; `server/nutrient.live.test.ts` documents the successful opt-in live test. | Upload the provided non-sensitive invoice in an authenticated workspace, then open its review page. | The public route is representative and synthetic. A private upload is required for a new live extraction. |
| **Low confidence changes the workflow.** | `Payment terms` is visually flagged at 72% in `/review/sample-invoice`; finalization is blocked until required fields are confirmed. Unit coverage: `server/proofpilot.test.ts`. | Open the sample review and inspect the highlighted field plus the approval guardrail. | Confidence routing assists human review; it is not an automated approval decision. |
| **SerpApi is a review-time decision input, not decorative search.** | The private reviewer panel triggers issuer research only with an open exception, shows returned public sources, and records `serpapi.issuer.research`. Code: `server/serpapi.ts`, `server/routers.ts`; tests: `server/serpapi.test.ts`, `server/serpapi.live.test.ts`. | In an authenticated private document, select **Research issuer** after extraction; inspect the returned source cards and audit event. | Results are public research context. They do not verify an issuer’s identity, legal status, or document authenticity automatically. |
| **Research is attributable.** | The authenticated end-to-end run recorded `serpapi.issuer.research` with four returned findings for document `e6ad8bdf-f2f0-4c81-b776-af1aab4d1c88`; the audit UI displays timestamped workflow events. | Run the private synthetic flow and inspect the audit timeline after research completes. | The evidence records the query and public findings, not private document content. |
| **Nutrient DWS signing creates a tamper-evident artifact after review.** | `server/nutrient.ts`, `server/nutrient.processor.live.test.ts`, and `docs/integration-notes.md` record the independently live-validated signing run and `/ByteRange` marker check. | Resolve all required fields, then finalize in the authenticated flow when credits are available. | This demonstrates document integrity and organization-account attribution; it does not claim individual legal consent. |
| **The project is reproducible.** | Public source and setup guide: [github.com/himanshu748/proofpilot](https://github.com/himanshu748/proofpilot). Non-billing regression command: `pnpm test`; type check: `pnpm check`; production build: `pnpm build`. | Clone the repository, configure the documented server-side keys, and follow `README.md`. | `pnpm test:live` is intentionally opt-in because external API credits are consumed. |

## Sponsor-Track Narrative

| Track | One-sentence judge takeaway | Evidence to prioritize |
|---|---|---|
| **Nutrient DWS** | ProofPilot makes DWS the accountable document engine: extraction generates confidence-routed source evidence, and Processor signing creates the tamper-evident final record only after human review. | The source PDF, confidence visualization, review gate, `nutrient.extraction.completed` and `nutrient.signing.completed` audit events, and the `/ByteRange` validation note. |
| **SerpApi** | ProofPilot makes live issuer research part of the decision record at the exact moment a human must resolve an uncertain field. | The review-topic-aware query, returned public source cards, and persisted `serpapi.issuer.research` audit event. |
| **Overall** | ProofPilot converts a potentially plausible PDF extraction into an inspectable human decision with evidence, context, and a durable chronology. | The end-to-end public demo, review workspace, and audit trail. |

## Required Demo Phrasing

Use the following wording in the recording and on Devpost to keep the submission strong and precise:

> “Nutrient DWS extracts source-grounded fields with confidence. When a field is uncertain, ProofPilot pauses for a human review. SerpApi then brings in live public issuer context for that open review topic, and the research becomes part of the audit trail. Only after required review is complete does the DWS signing adapter produce the tamper-evident final record.”

Do **not** say that SerpApi verifies an issuer, that a search result proves authenticity, or that DWS signing represents personal legal consent. These boundaries preserve the submission’s credibility and match the app’s actual behavior.

## References

[1]: https://api-cloud-ai-hackathon-2026.devpost.com/ "DevNetwork [API + Cloud + AI] Hackathon 2026 — official challenge page"
[2]: https://github.com/himanshu748/proofpilot "ProofPilot public source repository"
