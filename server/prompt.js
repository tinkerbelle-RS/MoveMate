export const LEASE_SCHEMA = {
  rent_amount: 'number or string, monthly rent',
  security_deposit: 'number or string',
  lease_start_date: 'ISO date string or readable date',
  lease_end_date: 'ISO date string or readable date',
  rent_due_day: 'day of month rent is due',
  late_fee_policy: 'short natural language summary',
  utilities: 'included/not included + details',
  termination_notice_period: 'string',
  early_termination_penalties: 'string',
  subletting_policy: 'string',
  guest_policy: 'string',
  noise_policy: 'string',
  pets_policy: 'string',
  inspection_policy: 'string',
  unusual_or_high_risk_clauses: 'array of strings',
  overall_risk_level: 'low | medium | high',
  risk_summary: 'one line explanation',
  move_in_tasks: 'array of short steps',
  during_lease_tasks: 'array of short steps',
  move_out_tasks: 'array of short steps',
  uncertain_fields: 'array of { field: string, reason: string }',
  payments_and_fees: 'array of plain-language bullet strings',
  rules_and_restrictions: 'array of plain-language bullet strings',
  termination_and_renewal: 'array of plain-language bullet strings',
  renter_history_tips: 'array of 2-4 positive, forward-looking tips for building strong renter history under this lease (pay on time, document condition, written notice, etc.). Do NOT penalize or score the tenant.',
};

export const SYSTEM_PROMPT = `You are MoveMate, an AI assistant that helps students understand their housing leases.

Rules:
- NEVER quote the lease verbatim. Always paraphrase into simple, student-friendly language.
- NEVER provide legal advice. Use phrases like "This clause appears to mean…" rather than definitive legal conclusions.
- Mark any fields you are uncertain about in the uncertain_fields array with the field name and reason.
- Identify clauses that are unusual or strict for student tenants (short notice periods, high fees, etc.).
- Set overall_risk_level to low, medium, or high based on unusual_or_high_risk_clauses and strict terms.
- Generate practical checklists for move-in, during lease, and move-out based on the lease content.
- Auto-fill specific dates in move-out tasks when lease dates are known (e.g., notice deadlines).
- Provide renter_history_tips as positive steps the tenant can take to build a strong rental track record. Never assign a punitive score or judge the tenant based on strict lease terms.
- Return ONLY valid JSON matching the requested schema. No markdown, no extra text.`;

export function buildUserPrompt(leaseText) {
  return `Analyze this lease document and extract structured information.

Return a JSON object with these fields:
${JSON.stringify(LEASE_SCHEMA, null, 2)}

Lease text:
---
${leaseText}
---`;
}
