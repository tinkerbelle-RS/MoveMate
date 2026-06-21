import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Clock3,
  FileWarning,
  ListChecks,
  ShieldCheck,
  TrendingUp,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { getChecklistStats, getDeadlineItems, getNextActions, getRiskTone } from '../../lib/dashboardInsights';

const toneClass = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  slate: 'bg-slate-50 text-slate-600 ring-slate-100',
};

export function ChecklistProgress({ checklists }) {
  const stats = getChecklistStats(checklists);

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Progress</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">Rental readiness</h3>
        </div>
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-brand-100">
          <div
            className="absolute inset-1 rounded-full"
            style={{ background: `conic-gradient(#14b8a6 ${stats.pct * 3.6}deg, #e0e7ff 0deg)` }}
          />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-brand-700">
            {stats.pct}%
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {stats.sections.map((section) => (
          <div key={section.key}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{section.label}</span>
              <span className="text-slate-500">{section.done}/{section.total}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-accent-400" style={{ width: `${section.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DeadlineTimeline({ analysis, checklists }) {
  const deadlines = getDeadlineItems(analysis, checklists);

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Timeline</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">Upcoming lease moments</h3>
        </div>
        <CalendarDays className="h-5 w-5 text-slate-400" />
      </div>

      <div className="mt-5 space-y-4">
        {deadlines.length ? deadlines.map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex gap-3">
            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${toneClass[item.tone] || toneClass.slate}`}>
              <Clock3 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">{item.label}</p>
              <p className="text-xs font-medium text-slate-500">{item.formattedDate}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.detail}</p>
            </div>
          </div>
        )) : (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Lease dates were not clear enough to build a timeline. Check the original lease for notice and renewal windows.
          </div>
        )}
      </div>
    </div>
  );
}

export function RiskAndUncertaintyPanel({ analysis }) {
  const risk = getRiskTone(analysis.overall_risk_level);
  const clauses = analysis.unusual_or_high_risk_clauses || [];
  const uncertain = analysis.uncertain_fields || [];

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Risk review</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">Clauses to verify</h3>
        </div>
        <span className={`status-pill ${risk.pill}`}>{risk.label}</span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        {analysis.risk_summary || 'MoveMate did not find a detailed risk summary. Review the key terms below against the original lease.'}
      </p>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
            <ShieldAlert className="h-4 w-4" />
            Strict or unusual
          </div>
          <ul className="mt-3 space-y-2 text-sm text-amber-900/90">
            {clauses.length ? clauses.slice(0, 4).map((clause, index) => <li key={index}>{clause}</li>) : <li>No strict clauses were flagged.</li>}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <FileWarning className="h-4 w-4" />
            Needs confirmation
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {uncertain.length ? uncertain.slice(0, 4).map((field, index) => <li key={index}>{field.reason || field.field}</li>) : <li>No uncertain fields were reported.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function NextBestActions({ analysis, checklists }) {
  const actions = getNextActions(analysis, checklists);

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Next</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">Best actions</h3>
        </div>
        <Sparkles className="h-5 w-5 text-brand-500" />
      </div>

      <div className="mt-5 space-y-3">
        {actions.length ? actions.map((action, index) => {
          const Icon = action.type === 'risk' ? AlertTriangle : action.type === 'uncertain' ? CircleDot : CheckCircle2;
          return (
            <div key={`${action.label}-${index}`} className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${action.type === 'risk' ? 'text-amber-600' : action.type === 'uncertain' ? 'text-slate-500' : 'text-emerald-600'}`} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{action.label}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-700">{action.text}</p>
              </div>
            </div>
          );
        }) : (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No action items yet. Upload a lease or add checklist tasks to build a plan.
          </div>
        )}
      </div>
    </div>
  );
}


export function InsightSnapshot({ analysis, checklists }) {
  const stats = getChecklistStats(checklists);
  const deadlines = getDeadlineItems(analysis, checklists);
  const actions = getNextActions(analysis, checklists);
  const topRisk = (analysis.unusual_or_high_risk_clauses || [])[0] || 'No major clause was flagged. Keep checking the original lease for details.';
  const nextDeadline = deadlines[0];
  const renterAction = (analysis.renter_history_tips || [])[0] || 'Save payment confirmations and document condition photos to build a stronger rental record.';

  const cards = [
    {
      label: 'Risk to review',
      value: topRisk,
      icon: ShieldAlert,
      className: 'border-amber-100 bg-gradient-to-br from-amber-50 to-white text-amber-950',
    },
    {
      label: 'Next deadline',
      value: nextDeadline ? `${nextDeadline.label} · ${nextDeadline.formattedDate}` : 'No date-specific deadline found yet.',
      icon: CalendarDays,
      className: 'border-brand-100 bg-gradient-to-br from-brand-50 to-white text-brand-950',
    },
    {
      label: 'Checklist momentum',
      value: `${stats.done}/${stats.total} tasks complete (${stats.pct}%)`,
      icon: ListChecks,
      className: 'border-accent-100 bg-gradient-to-br from-accent-50 to-white text-accent-950',
    },
    {
      label: 'Renter history move',
      value: renterAction,
      icon: TrendingUp,
      className: 'border-emerald-100 bg-gradient-to-br from-emerald-50 to-white text-emerald-950',
    },
  ];

  return (
    <section>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Snapshot</p>
          <h2 className="section-heading mt-1">What matters right now</h2>
        </div>
        <span className="brand-pill">Auto-built from your lease</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, className }) => (
          <div key={label} className={`rounded-xl border p-4 shadow-sm ${className}`}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/75 shadow-sm">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 line-clamp-3 text-sm font-semibold leading-relaxed">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DashboardWidgetGrid({ analysis, checklists }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ChecklistProgress checklists={checklists} />
      <DeadlineTimeline analysis={analysis} checklists={checklists} />
      <RiskAndUncertaintyPanel analysis={analysis} />
      <NextBestActions analysis={analysis} checklists={checklists} />
    </div>
  );
}
