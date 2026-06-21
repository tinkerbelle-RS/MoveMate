import { AlertCircle, AlertTriangle, CalendarDays, DollarSign, Home, ShieldCheck, WalletCards } from 'lucide-react';
import { formatCurrency, formatDate, isFieldUncertain, getUncertaintyReason } from '../lib/storage';
import { getLeaseDuration, getRiskTone } from '../lib/dashboardInsights';
import UncertainTooltip from './UncertainTooltip';
import RenterRatingCard from './RenterRatingCard';

const icons = {
  rent_amount: DollarSign,
  security_deposit: WalletCards,
  lease_start_date: CalendarDays,
  lease_end_date: Home,
};

function KpiCard({ label, value, field, analysis, helper }) {
  const uncertain = isFieldUncertain(analysis, field);
  const Icon = icons[field] || ShieldCheck;

  return (
    <div className="card relative overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {value ?? 'N/A'}
            {uncertain && <UncertainTooltip reason={getUncertaintyReason(analysis, field)} />}
          </p>
          {helper && <p className="mt-2 text-xs font-medium text-slate-500">{helper}</p>}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function AtAGlance({ analysis }) {
  const risk = getRiskTone(analysis.overall_risk_level);
  const duration = getLeaseDuration(analysis);
  const RiskIcon = analysis.overall_risk_level === 'low' ? ShieldCheck : analysis.overall_risk_level === 'high' ? AlertCircle : AlertTriangle;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Overview</p>
          <h2 className="section-heading mt-1">At a glance</h2>
        </div>
        <span className={`status-pill ${risk.pill}`}>
          <RiskIcon className="h-3.5 w-3.5" />
          {risk.label}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Monthly rent" value={formatCurrency(analysis.rent_amount)} field="rent_amount" analysis={analysis} helper={analysis.rent_due_day ? `Due ${analysis.rent_due_day}` : 'Due date unclear'} />
        <KpiCard label="Deposit" value={formatCurrency(analysis.security_deposit)} field="security_deposit" analysis={analysis} helper="Track condition photos" />
        <KpiCard label="Lease start" value={formatDate(analysis.lease_start_date)} field="lease_start_date" analysis={analysis} />
        <KpiCard label="Lease end" value={formatDate(analysis.lease_end_date)} field="lease_end_date" analysis={analysis} />
        <div className="card bg-gradient-to-br from-brand-600 to-accent-600 text-white">
          <p className="text-sm font-medium text-white/80">Duration</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{duration?.label || 'N/A'}</p>
          <p className="mt-2 text-xs font-medium text-white/65">{duration ? `${duration.days} days total` : 'Dates need review'}</p>
        </div>
      </div>

      <RenterRatingCard analysis={analysis} />
    </section>
  );
}
