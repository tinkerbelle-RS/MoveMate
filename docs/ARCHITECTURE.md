# MoveMate Architecture

MoveMate is a Vite React app with a small Express API. It is intentionally simple for a hackathon prototype: the browser owns interaction state, the server owns model calls, and demo mode keeps the experience usable without credentials.

## Runtime Components

### Browser

- Renders the React app.
- Extracts text from PDF files with pdf.js.
- Masks obvious personal identifiers before sending text to the API.
- Stores analyzed leases, checklist state, selected goals, goal evaluations, and comparison results in localStorage.

### Express API

- Provides `/api/health`, `/api/analyze`, `/api/evaluate-goals`, and `/api/compare-leases`.
- Validates minimum inputs.
- Calls Anthropic when `ANTHROPIC_API_KEY` is configured.
- Falls back to deterministic mock responses in demo mode.
- Normalizes model output so the frontend has stable fields.

### AI Layer

MoveMate uses separate prompts for separate jobs:

- Lease extraction: converts masked lease text into structured JSON.
- Goal fit: scores one lease against student priorities.
- Lease comparison: compares two normalized lease analyses against the same goals.

The prompts instruct the model to paraphrase, avoid legal advice, preserve uncertainty, and return JSON only.

## Data Flow

```text
PDF or pasted lease text
  -> client text extraction
  -> client PII masking
  -> POST /api/analyze
  -> normalized lease analysis
  -> localStorage dashboard state
  -> optional goal evaluation
  -> optional second lease comparison
```

## Storage Model

The prototype uses localStorage keys:

- `movemate_lease`: primary analyzed lease and checklist state.
- `movemate_lease_b`: comparison lease.
- `movemate_goals`: selected student priorities.
- `movemate_goal_eval`: latest goal-fit result.
- `movemate_compare`: latest comparison result.

No raw lease text is intentionally stored after analysis.

## Privacy Boundaries

Current protections:

- Browser-side PDF extraction.
- Best-effort client redaction for common identifiers.
- Local-only prototype state.
- Delete-data control.
- No landlord-facing score or automated housing decision.

Production requirements:

- Stronger redaction tests and OCR handling.
- Authentication and authorization if accounts are added.
- Encryption at rest and in transit for any retained data.
- Retention controls and export/delete flows.
- Abuse prevention and rate limiting.
- Legal review for jurisdiction-specific guidance.

## Extension Points

- Add OCR before `extractTextFromPdf` for scanned PDFs.
- Replace localStorage with a student-owned account store.
- Add calendar export for deadlines.
- Add campus resource routing based on school or city.
- Add jurisdiction rule packs that annotate AI output with verified local requirements.
- Add an opt-in renter-history export built from completed checklist events.
