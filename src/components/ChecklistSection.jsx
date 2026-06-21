import { useState } from 'react';

export function ChecklistSection({ title, subtitle, items = [], sectionKey, onUpdate }) {
  const [expandedNotes, setExpandedNotes] = useState({});

  const doneCount = items.filter((i) => i.done).length;

  return (
    <div className="card">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="mt-0.5 text-sm text-slate-600">{subtitle}</p>
        </div>
        <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          {doneCount}/{items.length} done
        </span>
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={item.done}
                onChange={(e) => onUpdate(sectionKey, item.id, { done: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span className={`text-sm ${item.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                {item.text}
              </span>
            </label>

            {expandedNotes[item.id] || item.notes ? (
              <textarea
                placeholder="Add notes…"
                value={item.notes}
                onChange={(e) => onUpdate(sectionKey, item.id, { notes: e.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                rows={2}
              />
            ) : (
              <button
                type="button"
                onClick={() => setExpandedNotes((p) => ({ ...p, [item.id]: true }))}
                className="mt-1 ml-7 text-xs text-brand-600 hover:underline"
              >
                + Add notes
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
