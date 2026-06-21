import fetch from 'node-fetch';
import { getAnthropicApiKey } from './config.js';

const DEFAULT_MODEL = 'claude-sonnet-4-6';
const MAX_LEASE_CHARS = 80000;

/**
 * Demo lease analysis when no API key is configured.
 */
export function getMockAnalysis() {
  return normalizeAnalysis({
    rent_amount: 1250,
    security_deposit: 1250,
    lease_start_date: '2025-08-15',
    lease_end_date: '2026-07-31',
    rent_due_day: '1st of each month',
    late_fee_policy:
      'Rent appears due on the 1st. A late fee of $75 may apply if payment is not received by the 5th.',
    utilities: 'Water and trash included. Tenant pays electricity and internet.',
    termination_notice_period: '60 days written notice required before lease end',
    early_termination_penalties:
      'Breaking the lease early may require forfeiting the deposit and paying two months rent.',
    subletting_policy: 'Subletting appears to require written landlord approval.',
    guest_policy: 'Overnight guests allowed up to 14 consecutive days per month.',
    noise_policy: 'Quiet hours appear to be 10 PM to 8 AM on weekdays.',
    pets_policy: 'No pets allowed without a $300 pet deposit and approval.',
    inspection_policy: 'Landlord may inspect with 24 hours notice.',
    unusual_or_high_risk_clauses: [
      '60-day move-out notice is longer than typical for student housing',
      'Early termination penalty of two months rent is relatively strict',
    ],
    overall_risk_level: 'medium',
    risk_summary:
      'A few clauses look stricter than average for student leases, especially notice and early exit terms.',
    move_in_tasks: [
      'Document existing damage with photos and a timestamp',
      'Confirm key and lock policy with landlord',
      'Verify condition of appliances and HVAC',
      'Test smoke detectors and note any issues',
      'Set up utilities in your name if required',
    ],
    during_lease_tasks: [
      'Set a calendar reminder for rent due on the 1st',
      'Keep copies of all repair requests and responses',
      'Review guest and noise policies before hosting',
      'Track any lease violations or warnings in writing',
    ],
    move_out_tasks: [
      'Give 60-day written notice by May 31, 2026',
      'Schedule move-out inspection with landlord',
      'Deep clean unit and document final condition',
      'Return all keys and get written confirmation',
      'Forward mail and update your address',
    ],
    uncertain_fields: [],
    payments_and_fees: [
      'Monthly rent of $1,250 due on the 1st',
      'Security deposit of $1,250 held until move-out',
      'Late fee of $75 if rent is not received by the 5th',
      'Water and trash included; electricity and internet are tenant-paid',
    ],
    rules_and_restrictions: [
      'Overnight guests limited to 14 consecutive days per month',
      'Quiet hours appear to be 10 PM to 8 AM on weekdays',
      'No pets without approval and a $300 pet deposit',
      'Subletting requires written landlord approval',
    ],
    termination_and_renewal: [
      '60 days written notice required to end lease at term',
      'Early termination may forfeit deposit and require two months rent',
      'Landlord may inspect with 24 hours notice',
      'Renewal terms not specified. Ask landlord before lease end.',
    ],
    renter_score: 665,
    renter_rating_label: 'Fair',
    renter_rating_summary:
      'Strict notice and early-exit terms mean one misstep could hurt your record — but consistent on-time rent and documented move-out can still build solid history.',
    renter_history_tips: [
      'Pay rent by the 1st every month and save confirmation receipts for future applications.',
      'Photo-document the unit at move-in and move-out to protect your deposit and reputation.',
      'Give 60-day notice in writing and keep proof — future landlords may ask for reference checks.',
    ],
  });
}

function asStringArray(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim());
  }
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }
  return [];
}

export function normalizeAnalysis(raw = {}) {
  const riskLevel = ['low', 'medium', 'high'].includes(raw.overall_risk_level)
    ? raw.overall_risk_level
    : 'medium';

  return {
    rent_amount: raw.rent_amount ?? null,
    security_deposit: raw.security_deposit ?? null,
    lease_start_date: raw.lease_start_date ?? null,
    lease_end_date: raw.lease_end_date ?? null,
    rent_due_day: raw.rent_due_day ?? null,
    late_fee_policy: raw.late_fee_policy ?? null,
    utilities: raw.utilities ?? null,
    termination_notice_period: raw.termination_notice_period ?? null,
    early_termination_penalties: raw.early_termination_penalties ?? null,
    subletting_policy: raw.subletting_policy ?? null,
    guest_policy: raw.guest_policy ?? null,
    noise_policy: raw.noise_policy ?? null,
    pets_policy: raw.pets_policy ?? null,
    inspection_policy: raw.inspection_policy ?? null,
    unusual_or_high_risk_clauses: asStringArray(raw.unusual_or_high_risk_clauses),
    overall_risk_level: riskLevel,
    risk_summary: raw.risk_summary ?? null,
    move_in_tasks: asStringArray(raw.move_in_tasks),
    during_lease_tasks: asStringArray(raw.during_lease_tasks),
    move_out_tasks: asStringArray(raw.move_out_tasks),
    uncertain_fields: Array.isArray(raw.uncertain_fields) ? raw.uncertain_fields : [],
    payments_and_fees: asStringArray(raw.payments_and_fees),
    rules_and_restrictions: asStringArray(raw.rules_and_restrictions),
    termination_and_renewal: asStringArray(raw.termination_and_renewal),
    renter_score: raw.renter_score != null ? clampRenterScore(raw.renter_score) : null,
    renter_rating_label: raw.renter_rating_label ?? null,
    renter_rating_summary: raw.renter_rating_summary ?? null,
    renter_history_tips: asStringArray(raw.renter_history_tips),
  };
}

function clampRenterScore(score) {
  const n = Number(score);
  if (Number.isNaN(n)) return null;
  return Math.min(850, Math.max(300, Math.round(n)));
}

function parseModelJson(text) {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    // continue
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    return JSON.parse(fenced[1].trim());
  }

  const objectMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!objectMatch) {
    throw new Error('AI returned invalid response format');
  }

  return JSON.parse(objectMatch[0]);
}

function formatApiError(status, body) {
  try {
    const parsed = JSON.parse(body);
    const message = parsed?.error?.message || parsed?.message;

    if (status === 404 && message?.includes('model')) {
      return 'AI model not found. Update ANTHROPIC_MODEL in .env to claude-sonnet-4-6 and restart the server.';
    }

    if (message) {
      return message;
    }
  } catch {
    // ignore
  }

  if (status === 401) {
    return 'Invalid Anthropic API key. Check ANTHROPIC_API_KEY in your .env file.';
  }

  if (status === 429) {
    return 'Anthropic rate limit reached. Wait a moment and try again.';
  }

  return `AI analysis failed (${status}). Check your API key and try again.`;
}

function prepareLeaseText(leaseText) {
  const trimmed = leaseText.trim();
  if (trimmed.length <= MAX_LEASE_CHARS) {
    return trimmed;
  }

  return `${trimmed.slice(0, MAX_LEASE_CHARS)}\n\n[Document truncated for analysis due to length.]`;
}

/**
 * Call Anthropic API to analyze lease text.
 */
export async function analyzeLease(leaseText) {
  const apiKey = getAnthropicApiKey();

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 1500));
    return getMockAnalysis();
  }

  const { buildUserPrompt, SYSTEM_PROMPT } = await import('./prompt.js');
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(prepareLeaseText(leaseText)) }],
    }),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(formatApiError(response.status, body));
  }

  const data = JSON.parse(body);
  const text = data.content?.find((block) => block.type === 'text')?.text ?? '';

  if (!text) {
    throw new Error('AI returned an empty response. Please try again.');
  }

  return normalizeAnalysis(parseModelJson(text));
}
