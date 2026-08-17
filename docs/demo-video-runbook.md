# ProofPilot Sponsor-Track Demo Runbook

## Target

Record a **2 minute 40 second public walkthrough**. This duration is inside the official 2–4 minute requirement for the Nutrient DWS Challenge and long enough to prove both sponsor integrations in one coherent decision story. The video must show source PDF → DWS extraction → human exception → SerpApi context → audit evidence → DWS finalization or, if provider credits are temporarily unavailable, the previously verified signing evidence and the guardrail that prevents an unreviewed finalization.

> The video must not claim that web search verifies an issuer or establishes legal compliance. SerpApi is public research context for the human reviewer.

## Recording Sequence

| Time | On-screen action | Spoken proof point | Judge takeaway |
|---|---|---|---|
| 0–15s | Open the ProofPilot workspace and source invoice. | “A plausible document answer is not an approval.” | The project addresses a real accountability gap. |
| 15–40s | Upload the non-sensitive invoice. | “Nutrient DWS extracts source-grounded fields and confidence scores from the original PDF.” | DWS is product-critical, not decorative. |
| 40–65s | Open the review workspace; show the low-confidence payment-terms field and citation. | “Low confidence pauses the workflow instead of being silently accepted.” | Human-in-the-loop review is real and visible. |
| 65–95s | Run issuer research; show the live query and returned source cards. | “SerpApi brings live public context for this open review topic into the workspace. The reviewer, not the search result, makes the decision.” | SerpApi materially improves the review experience. |
| 95–125s | Confirm or correct the exception; show the audit trail. | “The query, returned research, extraction, and reviewer action are timestamped together.” | The decision is auditable and reproducible. |
| 125–150s | Approve and execute DWS finalization if credits permit; otherwise show the finalization guardrail and verified signing evidence. | “Only after review does Nutrient DWS Processor create the tamper-evident final record.” | Signing is gated by human review. |
| 150–160s | Open the public demo route and close. | “ProofPilot turns a messy PDF into a decision you can defend.” | Judges have a safe, inspectable public entry point. |

## Pre-recording Checklist

- Use only the non-sensitive synthetic invoice PDF.
- Confirm Manus sign-in, `NUTRIENT_DWS_API_KEY`, and `SERPAPI_API_KEY` are available.
- Restore or obtain Nutrient Processor credits before recording a live signing step; the previous repeat signing test returned `402` after the separate free Processor balance was exhausted.
- Keep browser zoom at 125% or lower, close unrelated tabs, and hide notifications.
- Record a continuous screen capture at 1080p or higher; use clean voiceover rather than background music.
- Publish the video at an accessible public or unlisted URL and paste that exact URL into ProofPilot’s submission page before final Devpost submission.

## Video Description

> **ProofPilot** is an evidence-first document decision workspace. Nutrient DWS extracts source-grounded data, routes uncertainty to human review, and produces a tamper-evident final artifact after approval. SerpApi adds live public issuer context precisely when a reviewer must resolve an exception, while ProofPilot records the query, evidence, and decision in one audit trail.

## References

[1]: https://api-cloud-ai-hackathon-2026.devpost.com/ "DevNetwork [API + Cloud + AI] Hackathon 2026 — official challenge page"
