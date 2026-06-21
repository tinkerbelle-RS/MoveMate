const STORAGE_KEY = 'movemate_lease';
const GOALS_KEY = 'movemate_goals';
const LEASE_B_KEY = 'movemate_lease_b';
const GOAL_EVAL_KEY = 'movemate_goal_eval';
const COMPARE_KEY = 'movemate_compare';

/** @returns {import('./types').StoredLease|null} */
export function getStoredLease() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** @param {import('./types').StoredLease|null} data */
export function setStoredLease(data) {
  if (data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function deleteStoredData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(GOALS_KEY);
  localStorage.removeItem(LEASE_B_KEY);
  localStorage.removeItem(GOAL_EVAL_KEY);
  localStorage.removeItem(COMPARE_KEY);
}

/** @returns {string[]} */
export function getStoredGoals() {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** @param {string[]} goals */
export function setStoredGoals(goals) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

/** @returns {object|null} */
export function getStoredLeaseB() {
  try {
    const raw = localStorage.getItem(LEASE_B_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** @param {object|null} data */
export function setStoredLeaseB(data) {
  if (data) {
    localStorage.setItem(LEASE_B_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(LEASE_B_KEY);
  }
}

/** @returns {object|null} */
export function getStoredGoalEval() {
  try {
    const raw = localStorage.getItem(GOAL_EVAL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** @param {object|null} data */
export function setStoredGoalEval(data) {
  if (data) {
    localStorage.setItem(GOAL_EVAL_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(GOAL_EVAL_KEY);
  }
}

/** @returns {object|null} */
export function getStoredCompare() {
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** @param {object|null} data */
export function setStoredCompare(data) {
  if (data) {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(COMPARE_KEY);
  }
}

/** @param {string[]} tasks @param {string} prefix */
export function tasksToChecklist(tasks = [], prefix = 'task') {
  return (tasks || []).map((text, i) => ({
    id: `${prefix}-${i}`,
    text,
    done: false,
    notes: '',
  }));
}

/** @param {import('./types').LeaseAnalysis} analysis */
export function buildChecklists(analysis) {
  return {
    moveIn: tasksToChecklist(analysis.move_in_tasks, 'move-in'),
    during: tasksToChecklist(analysis.during_lease_tasks, 'during'),
    moveOut: tasksToChecklist(analysis.move_out_tasks, 'move-out'),
  };
}

export function formatCurrency(value) {
  if (value == null || value === '') return null;
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, ''));
  if (Number.isNaN(num)) return String(value);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

export function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** @param {import('./types').LeaseAnalysis} analysis @param {string} field */
export function isFieldUncertain(analysis, field) {
  return (analysis.uncertain_fields || []).some((u) => u.field === field);
}

/** @param {import('./types').LeaseAnalysis} analysis @param {string} field */
export function getUncertaintyReason(analysis, field) {
  const item = (analysis.uncertain_fields || []).find((u) => u.field === field);
  return item?.reason || "We're not completely sure; please double-check the original lease.";
}
