import { formatDate } from './storage';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function subtractDays(date, days) {
  return addDays(date, -days);
}

function extractNoticeDays(text = '') {
  const match = String(text).match(/(\d{1,3})\s*(?:day|days)/i);
  return match ? Number(match[1]) : null;
}

export function getLeaseDuration(analysis = {}) {
  const start = parseDate(analysis.lease_start_date);
  const end = parseDate(analysis.lease_end_date);
  if (!start || !end || end <= start) return null;

  const days = Math.round((end - start) / MS_PER_DAY) + 1;
  const months = Math.max(1, Math.round(days / 30.44));
  return { days, months, label: months >= 12 ? `${Math.round(months / 12)} year lease` : `${months} month lease` };
}

export function getChecklistStats(checklists = {}) {
  const sections = [
    { key: 'moveIn', label: 'Move-in', items: checklists.moveIn || [] },
    { key: 'during', label: 'During lease', items: checklists.during || [] },
    { key: 'moveOut', label: 'Move-out', items: checklists.moveOut || [] },
  ].map((section) => {
    const done = section.items.filter((item) => item.done).length;
    const total = section.items.length;
    return { ...section, done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  });

  const done = sections.reduce((sum, section) => sum + section.done, 0);
  const total = sections.reduce((sum, section) => sum + section.total, 0);
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0, sections };
}

export function getDeadlineItems(analysis = {}, checklists = {}) {
  const items = [];
  const start = parseDate(analysis.lease_start_date);
  const end = parseDate(analysis.lease_end_date);
  const noticeDays = extractNoticeDays(analysis.termination_notice_period);

  if (start) {
    items.push({ label: 'Lease starts', date: start, detail: 'Complete move-in documentation and condition photos.', tone: 'brand' });
    items.push({ label: 'Move-in condition check', date: addDays(start, 2), detail: 'Report existing damage in writing if your lease requires it.', tone: 'slate' });
  }

  if (end && noticeDays) {
    items.push({ label: `${noticeDays}-day notice deadline`, date: subtractDays(end, noticeDays), detail: 'Send written notice and keep proof for your records.', tone: 'amber' });
  }

  if (end) {
    items.push({ label: 'Renewal check-in', date: subtractDays(end, 90), detail: 'Ask about renewal or start comparing alternatives.', tone: 'slate' });
    items.push({ label: 'Lease ends', date: end, detail: 'Return keys, document final condition, and confirm move-out in writing.', tone: 'brand' });
  }

  const moveOut = (checklists.moveOut || []).find((item) => /notice|inspect|key|clean/i.test(item.text));
  if (!items.length && moveOut) {
    items.push({ label: 'Move-out planning', date: null, detail: moveOut.text, tone: 'amber' });
  }

  return items
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date - b.date;
    })
    .slice(0, 5)
    .map((item) => ({ ...item, formattedDate: item.date ? formatDate(item.date.toISOString()) : 'Date not specified' }));
}

export function getNextActions(analysis = {}, checklists = {}) {
  const actions = [];

  Object.entries({ moveIn: 'Move-in', during: 'During lease', moveOut: 'Move-out' }).forEach(([key, label]) => {
    (checklists[key] || [])
      .filter((item) => !item.done)
      .slice(0, 1)
      .forEach((item) => actions.push({ label, text: item.text, type: 'task' }));
  });

  (analysis.unusual_or_high_risk_clauses || []).slice(0, 2).forEach((clause) => {
    actions.push({ label: 'Review clause', text: clause, type: 'risk' });
  });

  (analysis.uncertain_fields || []).slice(0, 1).forEach((field) => {
    actions.push({ label: 'Verify detail', text: field.reason || `Double-check ${field.field} in the original lease.`, type: 'uncertain' });
  });

  return actions.slice(0, 5);
}

export function getRiskTone(level) {
  if (level === 'low') return { label: 'Low risk', pill: 'border-emerald-200 bg-emerald-50 text-emerald-700', bar: 'bg-emerald-500' };
  if (level === 'high') return { label: 'High risk', pill: 'border-red-200 bg-red-50 text-red-700', bar: 'bg-red-500' };
  return { label: 'Moderate risk', pill: 'border-amber-200 bg-amber-50 text-amber-700', bar: 'bg-amber-500' };
}
