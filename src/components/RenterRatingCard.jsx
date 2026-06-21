import { Award, Circle, TrendingUp } from 'lucide-react';
import { getRenterRatingDisplay } from '../lib/renterRating';

export default function RenterRatingCard({ analysis }) {
  const { label, summary, tips } = getRenterRatingDisplay(analysis);

  return (
    <div className="card overflow-hidden p-0">
      <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
        <div className="border-b border-slate-200 bg-brand-50 p-6 text-slate-950 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
            <Award className="h-4 w-4" />
            Renter history
          </div>
          <p className="mt-6 text-3xl font-semibold tracking-tight">{label}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{summary}</p>
          <div className="mt-6 rounded-xl border border-brand-100 bg-white p-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>Start</span>
              <span>Green path</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-1/4 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-950">Path to a stronger renter record</h3>
          </div>
          {tips.length > 0 && (
            <ul className="mt-4 grid gap-3 lg:grid-cols-2">
              {tips.map((tip, i) => (
                <li key={i} className="flex gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 text-sm leading-relaxed text-slate-700">
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 fill-emerald-100 stroke-emerald-500 stroke-[3]" />
                  {tip}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Everyone starts with a clean slate. This is not a background check or legal rating, and it does not penalize you for lease wording.
          </p>
        </div>
      </div>
    </div>
  );
}
