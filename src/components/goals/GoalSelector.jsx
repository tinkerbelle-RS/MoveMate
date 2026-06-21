import { Check, Lock } from 'lucide-react';
import { GOAL_OPTIONS, MIN_GOALS, MAX_GOALS } from '../../lib/goals';

export default function GoalSelector({ selected, onChange }) {
  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((g) => g !== id));
      return;
    }
    if (selected.length >= MAX_GOALS) return;
    onChange([...selected, id]);
  };

  return (
    <div className="card">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Priorities</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">Your goals for this lease</h3>
          <p className="mt-1 text-sm text-slate-600">Pick {MIN_GOALS} to {MAX_GOALS} priorities. MoveMate scores fit across all dimensions.</p>
        </div>
        <span className="status-pill border-slate-200 bg-slate-50 text-slate-600">{selected.length}/{MAX_GOALS} selected</span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {GOAL_OPTIONS.map((goal) => {
          const isSelected = selected.includes(goal.id);
          const disabled = !isSelected && selected.length >= MAX_GOALS;
          return (
            <button
              key={goal.id}
              type="button"
              disabled={disabled}
              onClick={() => toggle(goal.id)}
              className={`min-h-[150px] rounded-xl border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-brand-100 ${
                isSelected
                  ? 'border-brand-400 bg-brand-50 text-slate-950 shadow-sm'
                  : disabled
                    ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400'
                    : 'border-slate-200 bg-white text-slate-800 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isSelected ? 'bg-white text-slate-950' : 'bg-slate-100 text-slate-500'}`}>
                  {disabled ? <Lock className="h-4 w-4" /> : isSelected ? <Check className="h-4 w-4" /> : goal.label.charAt(0)}
                </span>
              </div>
              <span className="mt-4 block text-sm font-semibold">{goal.label}</span>
              <span className={`mt-2 block text-xs leading-relaxed ${isSelected ? 'text-slate-600' : 'text-slate-500'}`}>{goal.description}</span>
            </button>
          );
        })}
      </div>

      {selected.length < MIN_GOALS && <p className="mt-3 text-xs font-medium text-amber-700">Select at least {MIN_GOALS} goals to evaluate lease fit.</p>}
    </div>
  );
}
