import { Check, FileText, Loader2, ShieldCheck } from 'lucide-react';

const steps = [
  { label: 'Extracting text', threshold: 15 },
  { label: 'Masking identifiers', threshold: 35 },
  { label: 'Analyzing lease', threshold: 75 },
  { label: 'Building dashboard', threshold: 96 },
];

export default function ProcessingCard({ fileName, progress = 0 }) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 text-white shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin-slow" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Secure analysis</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Building your lease workspace</h2>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <FileText className="h-4 w-4 shrink-0" />
            <span className="truncate font-medium">{fileName}</span>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {steps.map((step) => {
              const complete = progress >= step.threshold;
              return (
                <div key={step.label} className={`flex items-center gap-3 rounded-lg border p-3 ${complete ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full ${complete ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400'}`}>
                    {complete ? <Check className="h-3.5 w-3.5" /> : <Loader2 className="h-3.5 w-3.5 animate-spin-slow" />}
                  </div>
                  <span className="text-sm font-semibold">{step.label}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
            <p className="text-sm leading-relaxed text-emerald-900/80">
              Personal details are masked before model analysis. MoveMate summarizes your lease, but does not provide legal advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
