import { Banknote, DoorOpen, FileText, ShieldAlert } from 'lucide-react';

function findHighlights(items = [], unusualClauses = []) {
  return items.map((item) => {
    const lower = item.toLowerCase();
    return unusualClauses.some((clause) => lower.includes(clause.toLowerCase().slice(0, 20)) || clause.toLowerCase().includes(lower.slice(0, 20))) || /\b(strict|penalty|forfeit|not allowed|prohibited|24 hour|60 day|90 day)\b/i.test(item);
  });
}

function TermPanel({ title, icon: Icon, items, highlights }) {
  return (
    <div className="card p-0">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <h3 className="font-semibold text-slate-950">{title}</h3>
      </div>
      <div className="p-5">
        {items.length ? (
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li key={index} className={`rounded-lg border p-3 text-sm leading-relaxed ${highlights[index] ? 'border-amber-200 bg-amber-50 text-amber-950' : 'border-slate-100 bg-slate-50/70 text-slate-700'}`}>
                <div className="flex gap-2.5">
                  <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${highlights[index] ? 'bg-amber-500' : 'bg-brand-500'}`} />
                  <span>{item}</span>
                </div>
                {highlights[index] && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-amber-700">
                    <ShieldAlert className="h-3 w-3" />
                    Review closely
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No specific terms found in this category.</p>
        )}
      </div>
    </div>
  );
}

export default function KeyTerms({ analysis }) {
  const unusual = analysis.unusual_or_high_risk_clauses || [];

  const payments = analysis.payments_and_fees?.length > 0
    ? analysis.payments_and_fees
    : [analysis.late_fee_policy && `Late fees: ${analysis.late_fee_policy}`, analysis.utilities && `Utilities: ${analysis.utilities}`, analysis.rent_due_day && `Rent due: ${analysis.rent_due_day}`].filter(Boolean);

  const rules = analysis.rules_and_restrictions?.length > 0
    ? analysis.rules_and_restrictions
    : [analysis.guest_policy && `Guests: ${analysis.guest_policy}`, analysis.noise_policy && `Noise: ${analysis.noise_policy}`, analysis.pets_policy && `Pets: ${analysis.pets_policy}`, analysis.subletting_policy && `Subletting: ${analysis.subletting_policy}`].filter(Boolean);

  const termination = analysis.termination_and_renewal?.length > 0
    ? analysis.termination_and_renewal
    : [analysis.termination_notice_period && `Notice period: ${analysis.termination_notice_period}`, analysis.early_termination_penalties && `Early termination: ${analysis.early_termination_penalties}`, analysis.inspection_policy && `Inspections: ${analysis.inspection_policy}`].filter(Boolean);

  return (
    <section>
      <div className="mb-5">
        <p className="eyebrow">Lease terms</p>
        <h2 className="section-heading mt-1">Key obligations</h2>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <TermPanel title="Payments & fees" icon={Banknote} items={payments} highlights={findHighlights(payments, unusual)} />
        <TermPanel title="Rules & restrictions" icon={DoorOpen} items={rules} highlights={findHighlights(rules, unusual)} />
        <TermPanel title="Termination & renewal" icon={FileText} items={termination} highlights={findHighlights(termination, unusual)} />
      </div>
    </section>
  );
}
