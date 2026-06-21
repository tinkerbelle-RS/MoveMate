import { Award } from 'lucide-react';
import { getRenterRatingDisplay, tierFromScore, scoreToPercent } from '../lib/renterRating';
import UncertainTooltip from './UncertainTooltip';
import { isFieldUncertain, getUncertaintyReason } from '../lib/storage';

export default function RenterRatingCard({ analysis }) {
  const { score, label, summary, tips } = getRenterRatingDisplay(analysis);
  const tier = tierFromScore(score);
  const pct = scoreToPercent(score);
  const ringCircumference = 2 * Math.PI * 15.5;
  const ringOffset = ringCircumference - (pct / 100) * ringCircumference;
  const uncertain = isFieldUncertain(analysis, 'renter_score');

  return (
    <div className={`card mb-6 border-2 ${tier.border} ${tier.bg}`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                className="stroke-white/80"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                className={tier.ring}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
              />
            </svg>
            <div className="text-center">
              <p className={`text-3xl font-bold leading-none ${tier.text}`}>{score}</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                / 850
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Award className={`h-5 w-5 ${tier.text}`} />
              <p className="text-sm font-medium text-slate-600">Renter History Score</p>
              {uncertain && (
                <UncertainTooltip reason={getUncertaintyReason(analysis, 'renter_score')} />
              )}
            </div>
            <p className={`mt-1 text-xl font-bold ${tier.text}`}>{label}</p>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-600">{summary}</p>
          </div>
        </div>

        <div className="lg:max-w-xs lg:text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Score range
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/70">
            <div
              className={`h-full rounded-full transition-all ${tier.bar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-slate-500">
            <span>300</span>
            <span>850</span>
          </div>
        </div>
      </div>

      {tips.length > 0 && (
        <div className="mt-5 border-t border-white/60 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Build your renter history
          </p>
          <ul className="mt-2 space-y-1.5">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="text-brand-500">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">
        Like a credit score for renting — this estimates how well you can build a positive track
        record under this lease. Not a background check or legal rating.
      </p>
    </div>
  );
}
