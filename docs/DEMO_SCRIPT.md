# MoveMate Demo Script

Use this flow for a 3-5 minute hackathon demo.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Leave `ANTHROPIC_API_KEY` empty for demo mode, or add a real key for live Claude analysis.

## Walkthrough

1. Open `http://localhost:5173`.
2. Start on the landing page and explain the user: a student reading an off-campus lease for the first time.
3. Click **Paste lease text instead**.
4. Paste the synthetic lease from [examples/sample-student-lease.txt](../examples/sample-student-lease.txt).
5. Run analysis and wait for the dashboard.
6. Point out the at-a-glance terms: rent, deposit, lease dates, and risk level.
7. Open the key terms and checklist sections. Emphasize that the product turns legal text into actions.
8. Open **Lease fit**.
9. Select goals such as subletting, deposit safety, and predictable fees.
10. Run goal evaluation and explain that different students can get different fit guidance from the same lease.
11. Open **Compare leases**.
12. Paste the sample lease again, optionally changing the subletting or early termination terms before submitting.
13. Run comparison and show the row-by-row recommendation.
14. Open **Help** and mention privacy, limitations, and legal-resource escalation.

## Judge Talking Points

- MoveMate solves a real student housing problem without requiring landlords to change behavior first.
- The first use case is immediately useful: understand the lease in front of you.
- The longer-term idea is a student-owned renter history that can expand access without becoming another opaque credit score.
- The prototype is privacy-aware: browser PDF extraction, PII masking, local storage, and clear delete controls.
- Demo mode makes the project reliable even without API credentials during judging.

## Fallback Plan

If the AI API is unavailable, keep `.env` without `ANTHROPIC_API_KEY`. The app will use deterministic demo data while preserving the same UI flow.
