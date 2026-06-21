import { Award, Target } from 'lucide-react';
import { scoreBarColor, scoreColor } from '../../lib/goals';

export default function GoalFitChart({ evaluation, priorityIds = [] }) {
  if (!evaluation) return null;

  return (
    <div className="card">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl bg-gradient-to-br from-brand-600 via-teal-500 to-accent-700 p-6 text-white">
          <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
            <Award className="h-4 w-4" />
            Overall fit
          </div>
          <div className="mt-6 flex items-end gap-2">
            <p className="text-6xl font-semibold tracking-tight">{evaluation.overall_fit.toFixed(1)}</p>
            <p className="pb-2 text-sm font-medium text-white/65">/ 5</p>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/80">{evaluation.headline}</p>
        </div>

        <div className="space-y-4">
          {evaluation.dimensions.map((d) => {
            const isPriority = priorityIds.includes(d.id);
            const pct = (d.score / d.max_score) * 100;
            return (
              <div key={d.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-slate-400" />
                    <p className="font-semibold text-slate-950">{d.label}</p>
                    {isPriority && <span className="status-pill border-brand-200 bg-brand-50 text-brand-700">Priority</span>}
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${scoreColor(d.score)}`}>{d.score}/{d.max_score}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full transition-all ${scoreBarColor(d.score)}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{d.summary}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
