import { useState } from 'react';
import { ChevronDown, AlertTriangle } from 'lucide-react';

export default function AccordionSection({ title, items = [], highlightIndices = [] }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="card overflow-hidden p-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-slate-50"
      >
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <ChevronDown
          className={`h-5 w-5 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="border-t border-slate-100 px-6 pb-5 pt-2">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">No specific terms found in this category.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                  <span>
                    {item}
                    {highlightIndices.includes(i) && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        <AlertTriangle className="h-3 w-3" />
                        Strict / unusual
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
