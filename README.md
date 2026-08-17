# ProofPilot

> **From messy PDF to a decision you can defend.**

ProofPilot is an evidence-first PDF review workspace. It uses Nutrient DWS to extract confidence-scored source evidence and create a tamper-evident final artifact after human approval. SerpApi supplies live public issuer context for an open review exception; that research is visible to the reviewer and persisted in the audit trail.

## What Judges Can Verify

| Capability | Evidence in the application |
|---|---|
| Nutrient DWS extraction | Uploaded PDF becomes source-grounded fields with confidence scores and review routing. |
| Human decision gate | Low-confidence fields must be confirmed before finalization. |
| SerpApi research | A document-specific issuer and review-topic query returns public findings that are recorded with the review. |
| Nutrient DWS signing | Finalization writes a separate PDF artifact and signing evidence after approval. |
| Auditability | Upload, extraction, research, review, and finalization transitions are timestamped. |

## Architecture

```text
Source PDF → S3 → Nutrient DWS Data Extraction → confidence + citations
                                          ↓
                     Human exception review ← SerpApi public issuer context
                                          ↓
                timestamped audit trail → Nutrient DWS Processor → signed PDF
```

## Local Setup

1. Install Node.js 22+ and pnpm.
2. Install packages with `pnpm install`.
3. Configure the platform-provided database and OAuth environment variables required by the full-stack template.
4. Add these server-side integration variables; never expose them in the client:

   ```bash
   NUTRIENT_DWS_API_KEY=...
   NUTRIENT_DWS_PROCESSOR_API_KEY=...
   SERPAPI_API_KEY=...
   ```

5. Run the database migration appropriate to your environment, then start development with `pnpm dev`.
6. Sign in, upload a non-sensitive PDF, open its review page, run issuer research, resolve any low-confidence fields, and request finalization. The deployed public demo at `/demo/sample-invoice` links to the synthetic judge sample used in the recorded walkthrough.

## Verification

Run ordinary, non-billing checks:

```bash
pnpm test
pnpm check
pnpm build
```

Live provider tests are deliberately opt-in because they use external API credits:

```bash
pnpm test:live
```

## Privacy and Claim Boundaries

The public demo uses only a synthetic PDF. SerpApi queries use the extracted issuer plus a review-topic label; they do not submit document text, identifiers, or reviewer-entered values. Search results are context for a human reviewer, not automatic identity verification, legal advice, or a compliance certification.

## Hackathon Materials

The submission draft is in `docs/devpost-submission-draft.md`, the recording script is in `docs/demo-video-runbook.md`, and the evidence audit is in `docs/track-competitive-audit.md`.

## License

MIT
