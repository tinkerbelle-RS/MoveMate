# MoveMate

<p align="center">
  <strong>AI-powered lease clarity for student renters.</strong>
</p>

<p align="center">
  Upload a lease, define what matters to you, and get a practical rental dashboard for move-in, daily renting, move-out, lease comparison, and renter-history building.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=111111">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=ffffff">
  <img alt="Express" src="https://img.shields.io/badge/Express-API-111111?logo=express&logoColor=ffffff">
  <img alt="Anthropic" src="https://img.shields.io/badge/AI-Anthropic_Claude-D97757">
  <img alt="Privacy" src="https://img.shields.io/badge/Privacy-PII_masking-0F766E">
</p>

---

## Overview

MoveMate helps students understand rental agreements before small clauses become expensive surprises. The app turns a dense lease into a structured dashboard with key financial terms, risk indicators, plain-language obligations, personalized goal-fit analysis, and action checklists across the rental lifecycle.

The project is designed for students who are navigating housing for the first time, often without credit history, a cosigner, family renting experience, or easy access to legal support. MoveMate gives them immediate clarity on the lease in front of them and prototypes a fairer, student-owned renter history they can carry into future housing applications.

> MoveMate is an educational tool. It summarizes and structures lease information, but it does not provide legal advice or replace qualified tenant advocates, campus legal services, or attorneys.

## Product Highlights

| Capability | What it does | Why it matters |
| --- | --- | --- |
| Lease intake | Upload a PDF or paste lease text | Supports both formal leases and copied text from portals or emails |
| Client-side PDF parsing | Extracts lease text in the browser with pdf.js | Keeps raw document handling close to the user |
| PII masking | Redacts common identifiers before model analysis | Reduces exposure of sensitive lease information |
| Lease intelligence | Extracts rent, deposit, dates, fees, policies, risks, and unknowns | Converts legal language into a usable student dashboard |
| Goal-fit scoring | Scores how well a lease supports 2-3 selected student priorities | Makes the answer personal instead of generic |
| Lease comparison | Compares two leases against the same student goals | Helps students choose between real housing options |
| Lifecycle checklists | Generates move-in, during-lease, and move-out tasks | Turns analysis into concrete next actions |
| Renter history | Shows positive actions that build a portable rental track record | Prototypes trust without creating another opaque credit score |
| Demo mode | Works without an API key using realistic mock data | Keeps hackathon judging and local demos reliable |

## Demo

### Fastest Path

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Leave `ANTHROPIC_API_KEY` empty to use deterministic demo mode. Add a real key for live Claude analysis.

### Judge Walkthrough

1. Open the app and choose **Paste lease text instead**.
2. Paste the synthetic lease from [examples/sample-student-lease.txt](examples/sample-student-lease.txt).
3. Review rent, deposit, dates, risk level, key terms, and generated checklists.
4. Open **Lease fit**, select 2-3 priorities, and run the goal-fit analysis.
5. Open **Compare leases**, add a second lease, and compare both options row by row.
6. Open **Help** to review privacy, limitations, delete-data controls, and support resources.

A presenter-focused script is available in [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md).

## Why This Exists

For many students, housing is the largest and least forgiving cost of staying in school. Off-campus leases move quickly, the language is unfamiliar, and traditional screening systems often favor students who already have credit, guarantors, or family support.

MoveMate focuses on two outcomes:

1. **Immediate lease clarity:** Help a student understand obligations, dates, costs, restrictions, and next steps before they sign or move in.
2. **Fairer future trust:** Prototype an explainable renter history based on responsible actions the student owns and can choose to share.

## Core User Flow

```text
Lease PDF or pasted text
  -> Browser text extraction
  -> Client-side PII masking
  -> Express API validation
  -> Claude JSON analysis or demo fallback
  -> Dashboard, checklists, goal fit, and comparison
  -> Local browser storage with delete control
```

## Architecture

MoveMate is intentionally small and demo-friendly: React owns the user experience, Express owns model calls, and localStorage preserves prototype state without requiring accounts or a database.

| Layer | Implementation |
| --- | --- |
| Frontend | React 18, Vite 7, React Router |
| Interface | Tailwind CSS, lucide-react icons |
| Backend | Node.js, Express |
| AI provider | Anthropic Messages API |
| PDF extraction | pdfjs-dist |
| State persistence | Browser localStorage |
| Development | concurrently, npm scripts |

### Key Files

| File | Purpose |
| --- | --- |
| [src/pages/LandingPage.jsx](src/pages/LandingPage.jsx) | Lease upload, paste flow, progress states, and analysis request |
| [src/pages/DashboardPage.jsx](src/pages/DashboardPage.jsx) | Dashboard shell and tab routing |
| [src/components/goals/GoalsTab.jsx](src/components/goals/GoalsTab.jsx) | Student goals and lease-fit evaluation |
| [src/components/compare/CompareTab.jsx](src/components/compare/CompareTab.jsx) | Second-lease upload and side-by-side comparison |
| [src/lib/pdf.js](src/lib/pdf.js) | PDF text extraction and client-side identifier masking |
| [src/lib/storage.js](src/lib/storage.js) | localStorage persistence and checklist construction |
| [src/lib/renterRating.js](src/lib/renterRating.js) | Neutral renter-history display logic |
| [server/analyze.js](server/analyze.js) | Lease extraction, model call, normalization, and demo fallback |
| [server/goals.js](server/goals.js) | Goal-fit and comparison prompts |
| [server/prompt.js](server/prompt.js) | Lease schema and system prompt |

Detailed technical notes are in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Local Development

### Requirements

- Node.js 20.19+
- npm
- Optional Anthropic API key for live analysis

### Environment

Copy the example file:

```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `ANTHROPIC_API_KEY` | No | empty | Enables live Claude analysis. Empty value runs demo mode. |
| `ANTHROPIC_MODEL` | No | `claude-sonnet-4-6` | Model used by the backend. Override if your account uses a different model id. |
| `PORT` | No | `3001` | Express API port. |

### Commands

```bash
npm run dev          # Start Vite and Express together
npm run dev:client   # Start only the frontend
npm run dev:server   # Start only the API
npm run build        # Build the frontend for production
npm run preview      # Preview the production build
npm run check        # Submission verification build
npm run test:model   # Optional Anthropic connectivity test
```

## API Reference

### `GET /api/health`

Returns API health, AI mode, API-key status, and model metadata.

### `POST /api/analyze`

Analyzes masked lease text and returns normalized lease intelligence.

```json
{
  "leaseText": "Full masked lease text..."
}
```

### `POST /api/evaluate-goals`

Scores one analyzed lease against selected student priorities.

```json
{
  "analysis": {},
  "priorityGoals": ["sublet", "deposit"]
}
```

### `POST /api/compare-leases`

Compares two analyzed leases against the same priorities.

```json
{
  "analysisA": {},
  "analysisB": {},
  "priorityGoals": ["sublet", "deposit"],
  "labelA": "Lease A.pdf",
  "labelB": "Lease B.pdf"
}
```

## Privacy And Safety

MoveMate handles sensitive housing documents, so the prototype uses conservative defaults:

- PDF text extraction happens in the browser.
- Common identifiers are masked before API submission.
- Raw lease text is not intentionally stored after analysis.
- Dashboard state stays in localStorage for this prototype.
- Users can delete MoveMate data from the navigation or Help page.
- AI output includes uncertainty fields and should be checked against the original lease.
- The renter-history concept is opt-in, explainable, and student-owned.

Production deployment would require stronger redaction tests, authentication, encryption, retention controls, abuse prevention, audit logging, jurisdiction-specific legal review, and explicit consent flows for any sharing feature.

## Responsible AI Position

MoveMate uses AI to summarize and organize lease information. It does not automate housing decisions, rank tenants for landlords, or provide legal conclusions.

The renter-history concept is intentionally framed as a positive record of student actions, such as paying on time, documenting move-in condition, communicating in writing, and giving proper notice. The goal is to expand student agency without recreating opaque credit-style gatekeeping.

## Current Limitations

- Scanned leases may require OCR before the app can extract useful text.
- PII masking is best-effort and should not be treated as full anonymization.
- AI summaries can miss, simplify, or misinterpret lease language.
- Goal-fit scores are guidance, not legal or financial advice.
- State is stored in localStorage, not a production database.
- Renter history is a concept prototype, not a verified credential.

## Roadmap

- OCR support for image-only leases.
- Stronger privacy tests for redaction and retention.
- Jurisdiction-specific rule packs for student housing markets.
- Calendar exports for rent, notice, inspection, and renewal dates.
- Exportable student-owned renter-history report.
- Multilingual explanations for international students and families.
- Campus integrations with legal services, basic-needs offices, and tenant groups.
- Privacy-preserving aggregate insights for student advocates.

## Hackathon Snapshot

| Field | Details |
| --- | --- |
| Project | MoveMate |
| Pitch | Upload your lease, set your goals, and get a student-friendly rental dashboard that helps you understand today's contract while building a fairer renter history for tomorrow. |
| Audience | College students navigating off-campus leases, especially students without credit history, cosigners, or family renting experience |
| Built with | React, Vite, Tailwind CSS, Express, pdf.js, Anthropic Claude, localStorage |
| Status | Functional prototype with demo mode and live AI mode |

## License

No license has been selected yet. Add a license before distributing the project or accepting outside contributions.
