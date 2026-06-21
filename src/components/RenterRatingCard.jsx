import { Award, Circle, TrendingUp } from 'lucide-react';
import { getRenterRatingDisplay } from '../lib/renterRating';

export default function RenterRatingCard({ analysis }) {
  const { label, summary, tips } = getRenterRatingDisplay(analysis);

  return (
    <div className="card overflow-hidden p-0">
      <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
        <div className="bg-gradient-to-br from-brand-600 via-teal-500 to-accent-700 p-6 text-white">
          <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
            <Award className="h-4 w-4" />
            Renter history
          </div>
          <p className="mt-6 text-3xl font-semibold tracking-tight">{label}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/80">{summary}</p>
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-white/65">
              <span>Start</span>
              <span>Green path</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
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
