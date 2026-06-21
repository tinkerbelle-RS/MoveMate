import { HelpCircle } from 'lucide-react';

export default function UncertainTooltip({ reason }) {
  return (
    <span className="group relative ml-1 inline-flex">
      <HelpCircle className="h-4 w-4 cursor-help text-amber-500" />
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100">
        {reason || "We're not completely sure; please double-check the original lease."}
      </span>
    </span>
  );
}
