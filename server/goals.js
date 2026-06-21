import { callClaude, parseJsonFromText, isLiveAi } from './ai.js';

export const GOAL_DIMENSIONS = {
  sublet: {
    label: 'Sublet ability',
    shortLabel: 'Sublet in summer',
    question: 'I want to be able to sublet my room in summer',
  },
  early_exit: {
    label: 'Early exit flexibility',
    shortLabel: 'Early exit for internship',
    question: 'I might need to leave early for an internship / co-op',
  },
  deposit: {
    label: 'Deposit safety',
    shortLabel: 'Keep deposit',
    question: 'Keeping my security deposit is very important',
  },
  fees: {
    label: 'Fee predictability',
    shortLabel: 'Predictable rent',
    question: 'I need stable, predictable rent (no surprise fees)',
  },
  lifestyle: {
    label: 'Lifestyle fit',
    shortLabel: 'Guests & community',
    question: 'I care most about being able to have guests / community',
  },
};

const EVAL_SYSTEM = `You are MoveMate, helping students understand how well a lease fits their personal goals.

Rules:
- NEVER quote the lease verbatim. Paraphrase in plain, student-friendly language.
- NEVER provide legal advice. Use phrases like "This clause appears to mean…"
- Score each dimension from 1 (poor fit) to 5 (great fit) based on the parsed lease data.
- Return ONLY valid JSON. No markdown.`;

function buildEvalPrompt(analysis, priorityGoals) {
  const priorities = priorityGoals
    .map((id) => GOAL_DIMENSIONS[id]?.question)
    .filter(Boolean);

  return `Evaluate how well this lease fits the student's housing goals.

Student's top priorities (weight these slightly higher in your overall_fit calculation):
${priorities.map((p) => `- ${p}`).join('\n')}

Score ALL five dimensions (1-5):
- sublet: ability to sublet room, especially in summer
- early_exit: flexibility to leave early for internship/co-op
- deposit: likelihood of keeping security deposit at move-out
- fees: rent and fee predictability (late fees, surprise charges)
- lifestyle: guests, community, pets, noise policies

Parsed lease data:
${JSON.stringify(analysis, null, 2)}

Return JSON:
{
  "dimensions": [
    { "id": "sublet", "score": 1-5, "summary": "one sentence explanation" },
    { "id": "early_exit", "score": 1-5, "summary": "..." },
    { "id": "deposit", "score": 1-5, "summary": "..." },
    { "id": "fees", "score": 1-5, "summary": "..." },
    { "id": "lifestyle", "score": 1-5, "summary": "..." }
  ],
  "overall_fit": 1.0-5.0,
  "headline": "one sentence overall assessment for this student"
}`;
}

function mockEvaluation(analysis, priorityGoals) {
  const hasStrictEarly = /two month|forfeit|penalty/i.test(
    analysis.early_termination_penalties || ''
  );
  const strictSublet = /prohibited|not allowed|approval/i.test(
    analysis.subletting_policy || ''
  );
  const guestLimit = /14 day|limit|prohibited/i.test(analysis.guest_policy || '');

  const scores = {
    sublet: strictSublet ? 2 : 4,
    early_exit: hasStrictEarly ? 1 : 3,
    deposit: analysis.unusual_or_high_risk_clauses?.length > 1 ? 2 : 4,
    fees: /75|penalty|fee/i.test(analysis.late_fee_policy || '') ? 3 : 4,
    lifestyle: guestLimit ? 2 : 4,
  };

  const dimensions = Object.keys(GOAL_DIMENSIONS).map((id) => ({
    id,
    score: scores[id],
    summary: getMockSummary(id, analysis, scores[id]),
  }));

  const priorityScores = priorityGoals.length
    ? priorityGoals.map((id) => scores[id] || 3)
    : Object.values(scores);
  const overall =
    Math.round((priorityScores.reduce((a, b) => a + b, 0) / priorityScores.length) * 10) / 10;

  return normalizeEvaluation({ dimensions, overall_fit: overall, headline: getMockHeadline(overall) });
}

function getMockSummary(id, analysis, score) {
  const summaries = {
    sublet:
      score <= 2
        ? `Subletting appears to require landlord approval. ${analysis.subletting_policy || 'Policy unclear.'}`
        : 'Subletting may be possible with reasonable conditions.',
    early_exit:
      score <= 2
        ? `Early termination looks costly. ${analysis.early_termination_penalties || 'Penalties may apply.'}`
        : 'Early exit terms appear relatively manageable for students.',
    deposit:
      score <= 2
        ? 'Deposit return language looks subjective or strict. Document everything at move-in.'
        : 'Standard deposit terms with typical wear-and-tear language.',
    fees:
      score <= 3
        ? `Watch for fees beyond base rent. ${analysis.late_fee_policy || 'Review fee schedule carefully.'}`
        : 'Rent and fees appear relatively predictable.',
    lifestyle:
      score <= 2
        ? `Guest and community rules look restrictive. ${analysis.guest_policy || ''}`
        : 'Guest and lifestyle policies appear student-friendly.',
  };
  return summaries[id];
}

function getMockHeadline(overall) {
  if (overall >= 4) return 'This lease looks like a strong fit for your goals.';
  if (overall >= 3) return 'This lease is a moderate fit. Some goals may be harder to meet.';
  return 'This lease may conflict with several of your priorities. Review key clauses carefully.';
}

export function normalizeEvaluation(raw) {
  const dimensions = Object.keys(GOAL_DIMENSIONS).map((id) => {
    const found = (raw.dimensions || []).find((d) => d.id === id);
    const meta = GOAL_DIMENSIONS[id];
    const score = Math.min(5, Math.max(1, Number(found?.score) || 3));

    return {
      id,
      label: meta.label,
      shortLabel: meta.shortLabel,
      score,
      max_score: 5,
      summary: found?.summary || 'Unable to assess this dimension from available lease data.',
    };
  });

  const overall =
    raw.overall_fit != null
      ? Math.min(5, Math.max(1, Number(raw.overall_fit)))
      : Math.round((dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length) * 10) / 10;

  return {
    dimensions,
    overall_fit: overall,
    headline: raw.headline || getMockHeadline(overall),
  };
}

export async function evaluateGoals(analysis, priorityGoals = []) {
  if (!isLiveAi()) {
    await new Promise((r) => setTimeout(r, 1200));
    return mockEvaluation(analysis, priorityGoals);
  }

  const text = await callClaude(EVAL_SYSTEM, buildEvalPrompt(analysis, priorityGoals), 2048);
  if (!text) {
    return mockEvaluation(analysis, priorityGoals);
  }

  return normalizeEvaluation(parseJsonFromText(text));
}

const COMPARE_SYSTEM = `You are MoveMate, comparing two leases for a student based on their personal goals.

Rules:
- NEVER quote leases verbatim. Paraphrase in plain language.
- NEVER provide legal advice.
- For each goal, summarize how each lease performs in one short phrase.
- Set "better" to "a", "b", or "tie".
- Return ONLY valid JSON.`;

function buildComparePrompt(analysisA, analysisB, priorityGoals, labelA, labelB) {
  const goals = priorityGoals.length ? priorityGoals : Object.keys(GOAL_DIMENSIONS);

  return `Compare these two leases for a student with these priorities:
${goals.map((id) => `- ${GOAL_DIMENSIONS[id]?.question || id}`).join('\n')}

Lease A (${labelA}):
${JSON.stringify(analysisA, null, 2)}

Lease B (${labelB}):
${JSON.stringify(analysisB, null, 2)}

Return JSON:
{
  "rows": [
    {
      "goal_id": "sublet",
      "lease_a_summary": "short phrase",
      "lease_b_summary": "short phrase",
      "lease_a_fit": "low|medium|high",
      "lease_b_fit": "low|medium|high",
      "better": "a|b|tie"
    }
  ],
  "recommendation": "one sentence: which lease is better overall for this student and why"
}

Include a row for each goal: ${goals.join(', ')}`;
}

function mockComparison(analysisA, analysisB, priorityGoals, labelA, labelB) {
  const goals = priorityGoals.length ? priorityGoals : Object.keys(GOAL_DIMENSIONS);

  const scoreLease = (analysis, goalId) => {
    if (goalId === 'early_exit') {
      const strict = /two month|forfeit/i.test(analysis.early_termination_penalties || '');
      return strict ? 'low' : 'medium';
    }
    if (goalId === 'sublet') {
      const strict = /prohibited|not allowed/i.test(analysis.subletting_policy || '');
      return strict ? 'low' : 'high';
    }
    if (goalId === 'deposit') {
      return (analysis.unusual_or_high_risk_clauses?.length || 0) > 1 ? 'low' : 'medium';
    }
    if (goalId === 'fees') {
      return /75|penalty/i.test(analysis.late_fee_policy || '') ? 'medium' : 'high';
    }
    return /14 day|limit/i.test(analysis.guest_policy || '') ? 'low' : 'high';
  };

  const fitRank = { low: 1, medium: 2, high: 3 };

  const rows = goals.map((goalId) => {
    const aFit = scoreLease(analysisA, goalId);
    const bFit = scoreLease(analysisB, goalId);
    let better = 'tie';
    if (fitRank[aFit] > fitRank[bFit]) better = 'a';
    if (fitRank[bFit] > fitRank[aFit]) better = 'b';

    return {
      goal_id: goalId,
      goal_label: GOAL_DIMENSIONS[goalId]?.shortLabel || goalId,
      lease_a_summary: summarizeFit(aFit, goalId, 'a'),
      lease_b_summary: summarizeFit(bFit, goalId, 'b'),
      lease_a_fit: aFit,
      lease_b_fit: bFit,
      better,
    };
  });

  const aWins = rows.filter((r) => r.better === 'a').length;
  const bWins = rows.filter((r) => r.better === 'b').length;

  return {
    rows,
    label_a: labelA,
    label_b: labelB,
    recommendation:
      bWins > aWins
        ? `Lease B (${labelB}) appears better aligned with your goals overall.`
        : aWins > bWins
          ? `Lease A (${labelA}) appears better aligned with your goals overall.`
          : 'Both leases have trade-offs. Compare row by row for your top priorities.',
  };
}

function summarizeFit(fit, goalId, lease) {
  const meta = GOAL_DIMENSIONS[goalId];
  if (fit === 'high') return `Strong fit for ${meta?.shortLabel?.toLowerCase() || goalId}`;
  if (fit === 'low') return `Restrictive on ${meta?.shortLabel?.toLowerCase() || goalId}; low fit`;
  return `Mixed terms for ${meta?.shortLabel?.toLowerCase() || goalId}`;
}

export function normalizeComparison(raw, labelA, labelB) {
  const rows = (raw.rows || []).map((row) => ({
    goal_id: row.goal_id,
    goal_label: row.goal_label || GOAL_DIMENSIONS[row.goal_id]?.shortLabel || row.goal_id,
    lease_a_summary: row.lease_a_summary || '',
    lease_b_summary: row.lease_b_summary || '',
    lease_a_fit: row.lease_a_fit || 'medium',
    lease_b_fit: row.lease_b_fit || 'medium',
    better: ['a', 'b', 'tie'].includes(row.better) ? row.better : 'tie',
  }));

  return {
    rows,
    label_a: labelA,
    label_b: labelB,
    recommendation: raw.recommendation || 'Review each goal row to decide which lease fits you better.',
  };
}

export async function compareLeases(analysisA, analysisB, priorityGoals, labelA, labelB) {
  if (!isLiveAi()) {
    await new Promise((r) => setTimeout(r, 1500));
    return mockComparison(analysisA, analysisB, priorityGoals, labelA, labelB);
  }

  const text = await callClaude(
    COMPARE_SYSTEM,
    buildComparePrompt(analysisA, analysisB, priorityGoals, labelA, labelB),
    2048
  );

  if (!text) {
    return mockComparison(analysisA, analysisB, priorityGoals, labelA, labelB);
  }

  return normalizeComparison(parseJsonFromText(text), labelA, labelB);
}
