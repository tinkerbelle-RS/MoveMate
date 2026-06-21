/**
 * Derive renter rating display data from analysis (with fallback for older leases).
 */
export function getRenterRatingDisplay(analysis) {
  if (analysis?.renter_score != null) {
    return {
      score: clampScore(analysis.renter_score),
      label: analysis.renter_rating_label || tierFromScore(analysis.renter_score).label,
      summary:
        analysis.renter_rating_summary ||
        'Follow lease obligations consistently to strengthen your renter history.',
      tips: analysis.renter_history_tips || [],
    };
  }

  return deriveFallbackRating(analysis);
}

function clampScore(score) {
  const n = Number(score);
  if (Number.isNaN(n)) return 650;
  return Math.min(850, Math.max(300, Math.round(n)));
}

export function tierFromScore(score) {
  const s = clampScore(score);

  if (s >= 800) {
    return {
      label: 'Excellent',
      description: 'Strong potential to build standout renter history',
      ring: 'stroke-emerald-500',
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      bar: 'bg-emerald-500',
    };
  }
  if (s >= 740) {
    return {
      label: 'Very Good',
      description: 'Solid path to positive references',
      ring: 'stroke-teal-500',
      text: 'text-teal-700',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      bar: 'bg-teal-500',
    };
  }
  if (s >= 670) {
    return {
      label: 'Good',
      description: 'On track with consistent follow-through',
      ring: 'stroke-brand-500',
      text: 'text-brand-700',
      bg: 'bg-brand-50',
      border: 'border-brand-200',
      bar: 'bg-brand-500',
    };
  }
  if (s >= 580) {
    return {
      label: 'Fair',
      description: 'Some lease terms may make history harder to build',
      ring: 'stroke-amber-500',
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      bar: 'bg-amber-500',
    };
  }
  return {
    label: 'Needs Attention',
    description: 'Strict terms — extra care needed to protect your record',
    ring: 'stroke-red-500',
    text: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    bar: 'bg-red-500',
  };
}

function deriveFallbackRating(analysis) {
  if (!analysis) {
    return {
      score: 650,
      label: 'Good',
      summary: 'Upload a lease to see your renter history outlook.',
      tips: [],
    };
  }

  let score = 700;
  const tips = [];

  if (analysis.overall_risk_level === 'high') score -= 80;
  else if (analysis.overall_risk_level === 'medium') score -= 40;

  if (/two month|forfeit|penalty/i.test(analysis.early_termination_penalties || '')) {
    score -= 30;
    tips.push('Avoid early exit violations — they can hurt future landlord references.');
  }

  if (/late fee|penalty/i.test(analysis.late_fee_policy || '')) {
    tips.push('Pay rent on time every month; payment history is the #1 renter record builders look for.');
  }

  if ((analysis.unusual_or_high_risk_clauses || []).length > 0) {
    score -= 15;
    tips.push('Document unit condition at move-in to protect your deposit and reputation.');
  }

  if (tips.length === 0) {
    tips.push('Give proper move-out notice and get written confirmation to leave a clean trail.');
    tips.push('Keep copies of rent payments and repair requests for future applications.');
  }

  score = clampScore(score);
  const tier = tierFromScore(score);

  return {
    score,
    label: tier.label,
    summary: `Based on this lease, ${tier.description.toLowerCase()}. Staying on top of rent, notice periods, and move-out documentation helps future landlords see you as reliable.`,
    tips: tips.slice(0, 3),
  };
}

/** Score as percentage on 300–850 scale for progress bar */
export function scoreToPercent(score) {
  return ((clampScore(score) - 300) / 550) * 100;
}
