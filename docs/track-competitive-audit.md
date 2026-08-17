# ProofPilot Competitive Track Audit

**Status:** Working audit, updated August 17, 2026. This document separates official requirements from ProofPilot evidence that is actually verified in the running application.

## Official Sponsor-Track Brief

| Track | Official requirement and judging focus | Prize information | Source |
|---|---|---|---|
| **Nutrient DWS Challenge** | Use Nutrient DWS, its API, SDK, or Viewer for at least one core document operation meaningfully rather than as a throwaway call. The challenge specifically values deterministic, auditable output and a human-in-the-loop workflow where a guess is not acceptable. The required submission includes a public repo/shared link, setup instructions, a 2–4 minute end-to-end demo, and one line explaining where DWS does the heavy lifting and why. | First: $750 Visa Cash Gift Card plus DWS credits valued at $250; second: $250 Visa Cash Gift Card plus DWS credits valued at $250. | [Devpost overview](https://api-cloud-ai-hackathon-2026.devpost.com/) |
| **SerpApi – Best AI Use Case** | Build an innovative AI application using one or more SerpApi APIs for reliable, structured, real-time web data. The project must solve a meaningful problem and demonstrate how live search data improves the AI experience. Judging considers originality, technical execution, SerpApi integration, usability, and potential impact. | First: $1,000 cash plus $1,000 SerpApi credits; second: $500 cash plus $500 SerpApi credits. | [Devpost overview](https://api-cloud-ai-hackathon-2026.devpost.com/) |
| **Overall** | Judges consider progress, concept, and feasibility. | Overall winner: $12,500 cash, among other event prizes. | [Devpost overview](https://api-cloud-ai-hackathon-2026.devpost.com/) |

## Verified ProofPilot Evidence

| Requirement signal | ProofPilot evidence that can be demonstrated now | Competitive significance |
|---|---|---|
| Meaningful DWS core operation | A user uploads a source PDF; Nutrient DWS Data Extraction returns confidence-scored fields with source-grounded metadata; Nutrient Processor signing has separately been live-validated with an inspectable `/ByteRange` marker. | Strong match for the DWS requirement because the provider performs the central extraction and final-artifact operations rather than an isolated call. |
| Deterministic, auditable, human-in-the-loop document process | Low-confidence fields route to review; field edits, extraction, research, and finalization events are timestamped in an audit trail; finalization is guarded until review is resolved. | Direct match for the challenge's stated preference for auditable workflows with human oversight. |
| Live structured search improves the workflow | In the authenticated review run, SerpApi research returned four public issuer/policy findings and stored the research event in the audit trail for document `e6ad8bdf-f2f0-4c81-b776-af1aab4d1c88`. | Demonstrates that search results are not decorative: they are reviewer-visible, source-linked context for a document decision. |
| End-to-end usability | The app provides a workspace, reviewer flow, public synthetic demo, submission page, S3-backed source retention, and visible confidence and audit states. | Supports technical execution and usability, but the final video must make the decision consequence and reviewer benefit unmistakable. |

## Competitive Gaps To Close Before Submission

1. The public 2–4 minute demo video must show one full narrative arc: source PDF → DWS extraction → human exception → SerpApi issuer-context research → recorded decision/audit evidence → guarded finalization. It should explicitly say why each provider changes the outcome.
2. The Devpost description needs separate sponsor-specific paragraphs, not a generic integrations list. Each paragraph should connect the relevant live integration to a measurable reviewer decision point.
3. The public repository must include concise setup instructions, an architecture diagram, environment-variable names without secret values, and a reproducible non-sensitive sample flow.
4. The SerpApi storyline should avoid implying that web results prove an issuer's identity or legal status. The product uses them as public research context that a human reviewer must assess.

## Two-Track Win Conditions

| Track | What a judge must see in under four minutes | How ProofPilot will make it unambiguous |
|---|---|---|
| **Nutrient DWS** | Nutrient performs the document work that makes the product useful: it extracts source-grounded fields and creates the final tamper-evident artifact only after a human resolves uncertainty. | Open on the original invoice, show the DWS confidence and citation evidence, correct the low-confidence payment-term field, show the resulting audit event, then show the guarded signing step and `ByteRange` signing evidence. This follows the sponsor's own suggested invoice pattern without claiming legal compliance that the synthetic demo does not establish. |
| **SerpApi** | A live, structured web-data request changes the review context rather than merely decorating the screen. Its result must be visible, attributable, and persisted with the decision. | Trigger issuer research from the document under review, tie the search to the open review exception, show returned public sources, and point to the `serpapi.issuer.research` audit event. State clearly that the output is reviewer context, not automatic identity verification. |
| **Overall** | A viable workflow with visible progress, a real problem, and a credible path to adoption. | Frame the use case as invoice and document-exception review for operations/compliance teams: reduce unattended extraction risk, keep source and decision evidence together, and preserve a tamper-evident result after approval. |

## Submission Guardrails

- Claim **live validation** only for the documented synthetic-PDF extraction, signing, and authenticated issuer-research evidence.
- Claim **human review and auditability** as actual product behavior, not merely a future concept.
- Claim **SerpApi** as public, real-time research context; do not claim issuer authentication, legal verification, or policy compliance from search snippets.
- Use the official 2–4 minute video requirement even though the internal runbook is shorter: record a concise 2–4 minute version that keeps every sponsor-critical step visible.

## Primary Recommendation

Position ProofPilot as **a document decision system, not a PDF extractor**: Nutrient DWS converts an original PDF into inspectable, confidence-scored evidence and a verifiable final artifact; SerpApi supplies time-sensitive external context precisely when the human reviewer must decide whether that evidence is sufficient. This combined story is credible for both sponsor tracks because each integration has a distinct, live, product-critical role.

## References

[1]: https://api-cloud-ai-hackathon-2026.devpost.com/ "DevNetwork [API + Cloud + AI] Hackathon 2026 — official challenge page"
[2]: https://apiworld.co/hackathon/ "API World — Hackathon"
