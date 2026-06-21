import AccordionSection from './AccordionSection';

function findHighlightIndices(items = [], unusualClauses = []) {
  if (!items.length || !unusualClauses.length) return [];
  const indices = [];
  items.forEach((item, i) => {
    const lower = item.toLowerCase();
    const isUnusual = unusualClauses.some(
      (clause) =>
        lower.includes(clause.toLowerCase().slice(0, 20)) ||
        clause.toLowerCase().includes(lower.slice(0, 20))
    );
    if (isUnusual) indices.push(i);
  });
  // Also highlight items with strict keywords
  items.forEach((item, i) => {
    if (indices.includes(i)) return;
    if (/\b(strict|penalty|forfeit|not allowed|prohibited|24 hour|60 day|90 day)\b/i.test(item)) {
      indices.push(i);
    }
  });
  return indices;
}

export default function KeyTerms({ analysis }) {
  const unusual = analysis.unusual_or_high_risk_clauses || [];

  const payments =
    analysis.payments_and_fees?.length > 0
      ? analysis.payments_and_fees
      : [
          analysis.late_fee_policy && `Late fees: ${analysis.late_fee_policy}`,
          analysis.utilities && `Utilities: ${analysis.utilities}`,
          analysis.rent_due_day && `Rent due: ${analysis.rent_due_day}`,
        ].filter(Boolean);

  const rules =
    analysis.rules_and_restrictions?.length > 0
      ? analysis.rules_and_restrictions
      : [
          analysis.guest_policy && `Guests: ${analysis.guest_policy}`,
          analysis.noise_policy && `Noise: ${analysis.noise_policy}`,
          analysis.pets_policy && `Pets: ${analysis.pets_policy}`,
          analysis.subletting_policy && `Subletting: ${analysis.subletting_policy}`,
        ].filter(Boolean);

  const termination =
    analysis.termination_and_renewal?.length > 0
      ? analysis.termination_and_renewal
      : [
          analysis.termination_notice_period &&
            `Notice period: ${analysis.termination_notice_period}`,
          analysis.early_termination_penalties &&
            `Early termination: ${analysis.early_termination_penalties}`,
          analysis.inspection_policy && `Inspections: ${analysis.inspection_policy}`,
        ].filter(Boolean);

  return (
    <section>
      <h2 className="section-heading mb-6">Key terms & obligations</h2>
      <div className="space-y-4">
        <AccordionSection
          title="Payments & fees"
          items={payments}
          highlightIndices={findHighlightIndices(payments, unusual)}
        />
        <AccordionSection
          title="Rules & restrictions"
          items={rules}
          highlightIndices={findHighlightIndices(rules, unusual)}
        />
        <AccordionSection
          title="Termination & renewal"
          items={termination}
          highlightIndices={findHighlightIndices(termination, unusual)}
        />
      </div>
    </section>
  );
}
