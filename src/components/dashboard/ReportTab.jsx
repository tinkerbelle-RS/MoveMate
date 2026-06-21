import { Printer } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/storage';
import { getChecklistStats, getDeadlineItems, getLeaseDuration, getRiskTone } from '../../lib/dashboardInsights';
import { getRenterRatingDisplay } from '../../lib/renterRating';

function ReportSection({ title, children }) {
  return (
    <section className="border-t border-slate-200 pt-5 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function BulletList({ items }) {
  return items?.length ? (
    <ul className="space-y-2 text-sm leading-relaxed text-slate-700">
      {items.map((item, index) => <li key={index}>- {item}</li>)}
    </ul>
  ) : <p className="text-sm text-slate-500">No details available.</p>;
}

export default function ReportTab({ lease, priorityGoals = [], goalEvaluation }) {
  const { analysis, checklists, fileName, analyzedAt } = lease;
  const duration = getLeaseDuration(analysis);
  const risk = getRiskTone(analysis.overall_risk_level);
  const stats = getChecklistStats(checklists);
  const deadlines = getDeadlineItems(analysis, checklists);
  const renterHistory = getRenterRatingDisplay(analysis);

  return (
    <div className="space-y-5">
      <div className="no-print flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Printable summary</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">Renter-ready lease report</h2>
          <p className="mt-1 text-sm text-slate-600">Create a clean PDF for your records, advisor meetings, or move-out planning.</p>
        </div>
        <button type="button" className="btn-primary" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </button>
      </div>

      <article className="print-report card space-y-6 bg-white">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="eyebrow">MoveMate report</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">{fileName}</h1>
            <p className="mt-1 text-sm text-slate-500">Analyzed {new Date(analyzedAt).toLocaleDateString()}</p>
          </div>
          <span className={`status-pill ${risk.pill}`}>{risk.label}</span>
        </header>

        <ReportSection title="Lease basics">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Rent', formatCurrency(analysis.rent_amount)],
              ['Deposit', formatCurrency(analysis.security_deposit)],
              ['Start', formatDate(analysis.lease_start_date)],
              ['End', formatDate(analysis.lease_end_date)],
              ['Duration', duration?.label],
              ['Rent due', analysis.rent_due_day],
              ['Checklist', `${stats.done}/${stats.total} complete`],
              ['Goals selected', priorityGoals.length ? String(priorityGoals.length) : 'Not selected'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{value || 'N/A'}</p>
              </div>
            ))}
          </div>
        </ReportSection>

        <ReportSection title="Risk summary">
          <p className="text-sm leading-relaxed text-slate-700">{analysis.risk_summary || 'No risk summary was generated.'}</p>
          <BulletList items={analysis.unusual_or_high_risk_clauses} />
        </ReportSection>

        <ReportSection title="Upcoming deadlines">
          <div className="space-y-3">
            {deadlines.map((deadline, index) => (
              <div key={index} className="flex justify-between gap-4 rounded-lg border border-slate-200 p-3 text-sm">
                <div>
                  <p className="font-semibold text-slate-950">{deadline.label}</p>
                  <p className="text-slate-600">{deadline.detail}</p>
                </div>
                <p className="shrink-0 font-medium text-slate-600">{deadline.formattedDate}</p>
              </div>
            ))}
          </div>
        </ReportSection>

        <ReportSection title="Key obligations">
          <div className="grid gap-5 lg:grid-cols-3">
            <div><p className="mb-2 font-semibold text-slate-900">Payments</p><BulletList items={analysis.payments_and_fees} /></div>
            <div><p className="mb-2 font-semibold text-slate-900">Rules</p><BulletList items={analysis.rules_and_restrictions} /></div>
            <div><p className="mb-2 font-semibold text-slate-900">Move-out</p><BulletList items={analysis.termination_and_renewal} /></div>
          </div>
        </ReportSection>

        {goalEvaluation && (
          <ReportSection title="Goal fit">
            <p className="mb-3 text-sm text-slate-700">{goalEvaluation.headline}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {goalEvaluation.dimensions.map((dimension) => (
                <div key={dimension.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <p className="font-semibold text-slate-950">{dimension.label}</p>
                    <p className="font-bold text-slate-950">{dimension.score}/{dimension.max_score}</p>
                  </div>
                  <p className="mt-1 text-slate-600">{dimension.summary}</p>
                </div>
              ))}
            </div>
          </ReportSection>
        )}

        <ReportSection title="Renter history path">
          <p className="mb-3 text-sm leading-relaxed text-slate-700">{renterHistory.summary}</p>
          <BulletList items={renterHistory.tips} />
        </ReportSection>
      </article>
    </div>
  );
}
