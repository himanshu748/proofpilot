# ProofPilot Demo Video Runbook

## Target

Record a **90–120 second** public walkthrough after the Nutrient DWS credential has been configured. The video should show a single coherent proof: a source PDF is uploaded, fields are extracted with confidence signals, an uncertain field is reviewed by a person, an audit event is recorded, and the approved document is finalized through Nutrient DWS.

## Recording sequence

| Time | On-screen action | Judge takeaway |
|---|---|---|
| 0–10s | Open the ProofPilot workspace and state the problem. | AI document answers are not approvals. |
| 10–28s | Upload a non-sensitive invoice PDF. | The original PDF is stored and processing begins. |
| 28–48s | Open the review workspace and point out confidence scores plus source citations. | Extraction is source-grounded and uncertainty is explicit. |
| 48–68s | Correct or confirm the low-confidence field. | A person decides when a model is uncertain. |
| 68–85s | Show the timestamped audit timeline. | Every extraction and decision is traceable. |
| 85–105s | Approve the document and show the Nutrient finalization event plus output artifact. | The final record is tamper-evident and review-gated. |
| 105–120s | Open the share-safe public demo page and close with the one-line summary. | Judges can inspect the project without seeing private uploads. |

## Pre-recording checklist

- Use a non-sensitive test PDF that contains at least one ambiguous field.
- Confirm the `NUTRIENT_DWS_API_KEY` is configured and the live API call succeeds.
- Sign in to ProofPilot before recording the upload flow.
- Keep the browser at 125% zoom or below and hide unrelated tabs or notifications.
- Record the direct public demo URL separately for the submission form.

## Submission copy for the video description

> **ProofPilot** turns document AI into accountable workflows: Nutrient DWS extracts source-grounded data and confidence signals, people resolve uncertainty, every action is logged, and approval produces a tamper-evident final record.
