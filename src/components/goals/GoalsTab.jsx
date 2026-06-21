import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { useLease } from '../../context/LeaseContext';
import { MIN_GOALS } from '../../lib/goals';
import GoalSelector from './GoalSelector';
import GoalFitChart from './GoalFitChart';

export default function GoalsTab() {
  const { lease, priorityGoals, setPriorityGoals, goalEvaluation, saveGoalEvaluation, setError } = useLease();
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const evaluate = async () => {
    if (priorityGoals.length < MIN_GOALS) {
      setLocalError(`Select at least ${MIN_GOALS} goals to evaluate.`);
      return;
    }

    setLoading(true);
    setLocalError(null);
    setError(null);

    try {
      const res = await fetch('/api/evaluate-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis: lease.analysis, priorityGoals }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Evaluation failed');
      saveGoalEvaluation(data);
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="eyebrow">Personalized fit</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Lease fit for my life</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">Students do not all need the same lease. Choose your priorities and MoveMate will score how well this contract supports your plans.</p>
      </div>

      <GoalSelector selected={priorityGoals} onChange={setPriorityGoals} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="button" className="btn-primary" disabled={loading || priorityGoals.length < MIN_GOALS} onClick={evaluate}>
          {loading ? <><Loader2 className="h-5 w-5 animate-spin-slow" /> Evaluating fit</> : <><Sparkles className="h-5 w-5" /> See how this lease fits</>}
        </button>
        {goalEvaluation && !loading && <p className="text-sm text-slate-500">Change goals above and re-run to update scores.</p>}
      </div>

      {localError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{localError}</div>}
      {goalEvaluation && <GoalFitChart evaluation={goalEvaluation} priorityIds={priorityGoals} />}
    </div>
  );
}
