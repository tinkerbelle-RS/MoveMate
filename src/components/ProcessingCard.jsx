import { Loader2, FileText, ShieldCheck } from 'lucide-react';

export default function ProcessingCard({ fileName, progress = 0 }) {
  return (
    <div className="card mx-auto max-w-lg text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100">
        <Loader2 className="h-8 w-8 animate-spin-slow text-brand-600" />
      </div>

      <div className="mb-2 flex items-center justify-center gap-2 text-sm text-slate-600">
        <FileText className="h-4 w-4" />
        <span className="truncate font-medium">{fileName}</span>
      </div>

      <div className="mx-auto mb-6 h-2 max-w-xs overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <h2 className="text-lg font-semibold text-slate-900">Analyzing your lease…</h2>
      <p className="mt-2 text-sm text-slate-600">
        We&apos;re scanning your lease for key dates, fees, and obligations.
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-left">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <p className="text-xs leading-relaxed text-slate-600">
          Personal details are stripped before analysis; MoveMate does not provide legal advice.
        </p>
      </div>
    </div>
  );
}
