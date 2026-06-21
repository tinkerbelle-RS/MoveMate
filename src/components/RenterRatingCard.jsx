import { Award, Circle } from 'lucide-react';
import { getRenterRatingDisplay, NEUTRAL_TIER } from '../lib/renterRating';

export default function RenterRatingCard({ analysis }) {
  const { label, summary, tips } = getRenterRatingDisplay(analysis);
  const tier = NEUTRAL_TIER;
  const ringCircumference = 2 * Math.PI * 15.5;

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
                className={tier.ring}
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                className={tier.ringActive}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringCircumference}
                opacity="0.35"
              />
            </svg>
            <div className="text-center">
              <p className="text-3xl font-light leading-none text-slate-400">—</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                pending
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Award className={`h-5 w-5 ${tier.text}`} />
              <p className="text-sm font-medium text-slate-600">Renter History Score</p>
            </div>
            <p className={`mt-1 text-xl font-bold ${tier.text}`}>{label}</p>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-600">{summary}</p>
          </div>
        </div>

        <div className="lg:max-w-xs">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            How scoring works
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-0 rounded-full bg-emerald-400 transition-all" />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-slate-500">
            <span>Start here</span>
            <span className="text-emerald-600">Green at 670+</span>
          </div>
        </div>
      </div>

      {tips.length > 0 && (
        <div className="mt-5 border-t border-slate-200 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Path to a green score
          </p>
          <ul className="mt-2 space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-slate-700">
                <Circle className="mt-0.5 h-4 w-4 shrink-0 fill-emerald-100 stroke-emerald-500 stroke-[3]" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">
        Innocent until proven otherwise. We don&apos;t penalize you based on lease wording. Your
        score builds from what you actually do as a tenant. Not a background check or legal rating.
      </p>
    </div>
  );
}
