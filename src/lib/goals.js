export const GOAL_OPTIONS = [
  {
    id: 'sublet',
    label: 'Sublet my room in summer',
    description: 'I want to be able to sublet my room in summer',
  },
  {
    id: 'early_exit',
    label: 'Leave early for internship',
    description: 'I might need to leave early for an internship / co-op',
  },
  {
    id: 'deposit',
    label: 'Protect my deposit',
    description: 'Keeping my security deposit is very important',
  },
  {
    id: 'fees',
    label: 'Predictable rent & fees',
    description: 'I need stable, predictable rent (no surprise fees)',
  },
  {
    id: 'lifestyle',
    label: 'Guests & community',
    description: 'I care most about being able to have guests / community',
  },
];

export const MIN_GOALS = 2;
export const MAX_GOALS = 3;

export function scoreColor(score) {
  if (score >= 4) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (score >= 3) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-red-700 bg-red-50 border-red-200';
}

export function scoreBarColor(score) {
  if (score >= 4) return 'bg-emerald-500';
  if (score >= 3) return 'bg-amber-500';
  return 'bg-red-500';
}

export function fitBadgeClass(fit) {
  if (fit === 'high') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  if (fit === 'low') return 'bg-red-50 text-red-800 border-red-200';
  return 'bg-amber-50 text-amber-800 border-amber-200';
}
