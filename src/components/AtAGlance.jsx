import { formatCurrency, formatDate, isFieldUncertain, getUncertaintyReason } from '../lib/storage';
import UncertainTooltip from './UncertainTooltip';
import RenterRatingCard from './RenterRatingCard';
import { AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';

const riskConfig = {
  low: {
    label: 'Low risk',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    icon: ShieldCheck,
  },
  medium: {
    label: 'Moderate risk',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: AlertTriangle,
  },
  high: {
    label: 'High risk clauses detected',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: AlertCircle,
  },
};

function GlanceCard({ label, value, field, analysis }) {
  const uncertain = isFieldUncertain(analysis, field);

  return (
    <div className="card flex flex-col justify-center">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
        {value ?? 'N/A'}
        {uncertain && <UncertainTooltip reason={getUncertaintyReason(analysis, field)} />}
      </p>
    </div>
  );
}

export default function AtAGlance({ analysis }) {
  const risk = riskConfig[analysis.overall_risk_level] || riskConfig.medium;
  const RiskIcon = risk.icon;

  return (
    <section>
      <h2 className="section-heading mb-6">At a glance</h2>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlanceCard
          label="Monthly rent"
          value={formatCurrency(analysis.rent_amount)}
          field="rent_amount"
          analysis={analysis}
        />
        <GlanceCard
          label="Deposit"
          value={formatCurrency(analysis.security_deposit)}
          field="security_deposit"
          analysis={analysis}
        />
        <GlanceCard
          label="Lease start"
          value={formatDate(analysis.lease_start_date)}
          field="lease_start_date"
          analysis={analysis}
        />
        <GlanceCard
          label="Lease end"
          value={formatDate(analysis.lease_end_date)}
          field="lease_end_date"
          analysis={analysis}
        />
      </div>

      <RenterRatingCard analysis={analysis} />

      <div className={`rounded-2xl border p-5 ${risk.bg} ${risk.border}`}>
        <div className="flex items-start gap-3">
          <RiskIcon className={`mt-0.5 h-6 w-6 shrink-0 ${risk.text}`} />
          <div>
            <p className={`font-semibold ${risk.text}`}>{risk.label}</p>
            <p className={`mt-1 text-sm ${risk.text} opacity-90`}>
              {analysis.risk_summary ||
                'Review the key terms below to understand potential risks in your lease.'}
            </p>
            {(analysis.unusual_or_high_risk_clauses || []).length > 0 && (
              <ul className="mt-3 space-y-1">
                {analysis.unusual_or_high_risk_clauses.map((clause, i) => (
                  <li key={i} className={`text-sm ${risk.text} opacity-80`}>
                    • {clause}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
