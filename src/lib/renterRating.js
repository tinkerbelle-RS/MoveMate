/**
 * Neutral-slate renter rating — everyone starts fresh; no punitive scoring from lease terms.
 */
export function getRenterRatingDisplay(analysis) {
  return {
    score: null,
    label: 'Clean slate',
    summary:
      'Everyone starts with a neutral record. Follow the steps below to build a strong renter history. Your score reflects what you do, not what your lease says.',
    tips: buildGreenPathTips(analysis),
  };
}

const DEFAULT_TIPS = [
  'Pay rent on time every month and save confirmation receipts.',
  'Photo-document the unit at move-in and move-out.',
  'Keep copies of repair requests and landlord responses in writing.',
  'Give proper notice before moving out and get written confirmation.',
];

function buildGreenPathTips(analysis) {
  if (!analysis) return DEFAULT_TIPS;

  const fromAi = (analysis.renter_history_tips || [])
    .filter(Boolean)
    .map(reframeAsPositive);

  if (fromAi.length >= 2) return fromAi.slice(0, 4);

  const tips = [];

  if (analysis.rent_due_day) {
    tips.push(
      `Pay rent by the ${analysis.rent_due_day} each month and save receipts. On-time payments are the fastest way to earn a green score.`
    );
  } else {
    tips.push('Pay rent on time every month and save confirmation receipts.');
  }

  tips.push('Photo-document the unit at move-in and move-out to protect your deposit and reputation.');

  if (analysis.termination_notice_period) {
    tips.push(
      `Plan ahead: ${analysis.termination_notice_period}. Give notice in writing and keep proof for future references.`
    );
  } else {
    tips.push('Give proper move-out notice in writing and keep proof for future landlord references.');
  }

  if (analysis.late_fee_policy) {
    tips.push('Set a rent reminder before the due date to avoid late fees and keep your record clean.');
  }

  tips.push("Log repair requests in writing and follow up. It shows you're a responsible tenant.");

  return [...new Set(tips)].slice(0, 4);
}

/** Turn AI tips into forward-looking, positive framing */
function reframeAsPositive(tip) {
  return tip
    .replace(/^Avoid .+ — /i, '')
    .replace(/can hurt .+$/i, 'helps keep your record strong.')
    .replace(/may hurt/i, 'helps protect')
    .replace(/strict terms/i, 'your lease')
    .replace(/^(.+)$/, (m) => {
      if (/^pay |^photo|^give |^keep |^set |^log |^document/i.test(m)) return m;
      if (!m.endsWith('.')) return `${m}.`;
      return m;
    });
}

export const NEUTRAL_TIER = {
  label: 'Clean slate',
  ring: 'stroke-slate-200',
  ringActive: 'stroke-emerald-400',
  text: 'text-slate-700',
  bg: 'bg-slate-50',
  border: 'border-slate-200',
};
