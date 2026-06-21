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

function isLongText(text) {
  const value = String(text ?? '').trim();
  return value.length > 22 || /redacted|removed|not provided|not specified|unknown|unclear|reference|not available/i.test(value);
}

function moneyMetric(raw, fallbackHelper) {
  const formatted = formatCurrency(raw);
  if (!formatted) return { value: 'N/A', helper: fallbackHelper, compact: true };

  const valueText = String(formatted).trim();
  if (isLongText(valueText) || isLongText(raw)) {
    return { value: 'Needs review', helper: valueText, compact: false };
  }

  return { value: valueText, helper: null, compact: true };
}

function dateMetric(raw) {
  const formatted = formatDate(raw);
  if (!formatted) return { value: 'N/A', helper: 'Date not found', compact: true };

  const valueText = String(formatted).trim();
  if (isLongText(valueText)) {
    return { value: 'Needs review', helper: valueText, compact: false };
  }

  return { value: valueText, helper: null, compact: true };
}

function KpiCard({ label, value, field, analysis, helper, tone = 'brand', compact = true }) {
  const uncertain = isFieldUncertain(analysis, field);
  const Icon = icons[field] || ShieldCheck;
  const accentClass = tone === 'accent' ? 'border-l-amber-400' : 'border-l-brand-500';
  const iconClass = tone === 'accent'
    ? 'bg-amber-50 text-amber-700 ring-amber-100'
    : 'bg-brand-50 text-brand-700 ring-brand-100';

  return (
    <div className={`relative min-w-0 rounded-xl border border-slate-200 border-l-4 ${accentClass} bg-white p-5 shadow-sm`}>
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <div className="mt-2 flex min-w-0 items-start gap-2">
            <p
              className={`${compact ? 'text-2xl sm:text-[1.7rem]' : 'text-lg'} min-w-0 break-words font-semibold leading-tight tracking-tight text-slate-950`}
              title={String(value ?? 'N/A')}
            >
              {value ?? 'N/A'}
            </p>
            {uncertain && <UncertainTooltip reason={getUncertaintyReason(analysis, field)} />}
          </div>
          {helper && <p className="mt-2 break-words text-sm font-medium leading-relaxed text-slate-600">{helper}</p>}
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ${iconClass}`}>
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
  const rent = moneyMetric(analysis.rent_amount, 'Rent amount not found');
  const deposit = moneyMetric(analysis.security_deposit, 'Deposit amount not found');
  const start = dateMetric(analysis.lease_start_date);
  const end = dateMetric(analysis.lease_end_date);

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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Monthly rent" value={rent.value} field="rent_amount" analysis={analysis} helper={rent.helper || (analysis.rent_due_day ? `Due ${analysis.rent_due_day}` : 'Due date unclear')} compact={rent.compact} />
        <KpiCard label="Deposit" value={deposit.value} field="security_deposit" analysis={analysis} helper={deposit.helper || 'Track condition photos'} tone="accent" compact={deposit.compact} />
        <KpiCard label="Lease start" value={start.value} field="lease_start_date" analysis={analysis} helper={start.helper} compact={start.compact} />
        <KpiCard label="Lease end" value={end.value} field="lease_end_date" analysis={analysis} helper={end.helper} tone="accent" compact={end.compact} />
        <div className="rounded-xl border border-slate-200 border-l-4 border-l-brand-500 bg-white p-5 shadow-sm xl:col-span-2">
          <p className="text-sm font-medium text-slate-500">Duration</p>
          <p className="mt-2 break-words text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-[1.7rem]">{duration?.label || 'N/A'}</p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{duration ? `${duration.days} days total` : 'Dates need review'}</p>
        </div>
      </div>

      <RenterRatingCard analysis={analysis} />
    </section>
  );
}
