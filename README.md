# MoveMate

**The student housing OS** — upload your lease and get a clear, AI-generated dashboard from move-in to move-out.

## Features

- **PDF upload or paste text** — client-side PDF extraction with personal info masking
- **AI lease analysis** — powered by Claude (Anthropic API) with structured JSON output
- **At-a-glance dashboard** — rent, deposit, dates, and risk summary
- **Key terms** — payments, rules, and termination in plain language
- **Checklists** — move-in, during lease, and move-out with checkboxes and notes
- **Privacy-first** — PII masking, local storage, delete-my-data button

## Quick start

```bash
npm install
cp .env.example .env   # add your ANTHROPIC_API_KEY (optional — demo mode works without it)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Without an API key, the app runs in **demo mode** with sample analysis data so you can explore the full UI.

## Tech stack

- React + Vite
- Tailwind CSS
- Express API (port 3001)
- pdf.js for client-side PDF text extraction
- Anthropic Claude API for lease intelligence

## Privacy

- Personal identifiers (emails, phones, addresses, names) are masked client-side before analysis
- Lease data is stored in browser localStorage only
- Use "Delete my data" in the nav or Help page to clear everything

## Disclaimer

MoveMate summarizes lease documents for informational purposes. It does not provide legal advice. Always verify against your original lease and consult qualified resources for legal questions.
