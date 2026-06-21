import { useState } from 'react';
import { CheckCircle2, ClipboardList, MessageSquarePlus } from 'lucide-react';

export function ChecklistSection({ title, subtitle, items = [], sectionKey, onUpdate }) {
  const [expandedNotes, setExpandedNotes] = useState({});
  const doneCount = items.filter((i) => i.done).length;
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <div className="card p-0">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-950">{title}</h3>
              <p className="mt-0.5 text-sm text-slate-600">{subtitle}</p>
            </div>
          </div>
          <span className="status-pill border-brand-200 bg-brand-50 text-brand-700">{doneCount}/{items.length} done</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <ul className="divide-y divide-slate-100">
        {items.map((item) => (
          <li key={item.id} className="p-4 transition hover:bg-slate-50/70">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={item.done}
                onChange={(e) => onUpdate(sectionKey, item.id, { done: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-brand-500"
              />
              <span className={`min-w-0 flex-1 text-sm leading-relaxed ${item.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{item.text}</span>
              {item.done && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />}
            </label>

            {expandedNotes[item.id] || item.notes ? (
              <textarea
                placeholder="Add notes..."
                value={item.notes}
                onChange={(e) => onUpdate(sectionKey, item.id, { notes: e.target.value })}
                className="input-surface ml-7 mt-3 w-[calc(100%-1.75rem)] text-xs"
                rows={2}
              />
            ) : (
              <button type="button" onClick={() => setExpandedNotes((p) => ({ ...p, [item.id]: true }))} className="ml-7 mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-950">
                <MessageSquarePlus className="h-3.5 w-3.5" />
                Add notes
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
