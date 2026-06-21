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
      <h3 className="font-semibold text-slate-900">Your goals for this lease</h3>
      <p className="mt-1 text-sm text-slate-600">
        Pick {MIN_GOALS} to {MAX_GOALS} priorities. MoveMate scores how well this lease fits each one.
      </p>

      <div className="mt-4 space-y-3">
        {GOAL_OPTIONS.map((goal) => {
          const isSelected = selected.includes(goal.id);
          const disabled = !isSelected && selected.length >= MAX_GOALS;

          return (
            <label
              key={goal.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                isSelected
                  ? 'border-brand-300 bg-brand-50/60'
                  : disabled
                    ? 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-60'
                    : 'border-slate-200 bg-white hover:border-brand-200'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={disabled}
                onChange={() => toggle(goal.id)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span>
                <span className="block text-sm font-medium text-slate-900">{goal.label}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{goal.description}</span>
              </span>
            </label>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {selected.length}/{MAX_GOALS} selected
        {selected.length < MIN_GOALS && ` · select at least ${MIN_GOALS} to evaluate`}
      </p>
    </div>
  );
}
