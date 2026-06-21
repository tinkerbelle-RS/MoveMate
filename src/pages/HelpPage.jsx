import { ExternalLink, Shield, AlertCircle, Trash2 } from 'lucide-react';
import { useLease } from '../context/LeaseContext';

const resources = [
  {
    title: 'U.S. Dept. of Housing: Tenant Rights',
    url: 'https://www.hud.gov/topics/rental_assistance/tenants',
    description: 'Federal overview of tenant rights and fair housing.',
  },
];

export default function HelpPage() {
  const { clearData } = useLease();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Help & legal resources</h1>
      <p className="mt-2 text-slate-600">
        MoveMate helps you understand your lease, but it&apos;s not a lawyer.
      </p>

      <div className="mt-8 space-y-6">
        <div className="card">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-6 w-6 shrink-0 text-brand-600" />
            <div>
              <h2 className="font-semibold text-slate-900">What MoveMate can do</h2>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li>• Extract and summarize key lease terms in plain language</li>
                <li>• Flag clauses that look unusual or strict for student housing</li>
                <li>• Generate move-in, during-lease, and move-out checklists</li>
                <li>• Strip obvious personal info before AI analysis</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
            <div>
              <h2 className="font-semibold text-slate-900">What MoveMate cannot do</h2>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li>• Provide legal advice or tell you what to do in a dispute</li>
                <li>• Guarantee accuracy. Always verify against your original lease.</li>
                <li>• Replace a qualified attorney or tenant advocate</li>
                <li>• Negotiate with your landlord on your behalf</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-semibold text-slate-900">External resources</h2>
          <div className="space-y-3">
            {resources.map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card flex items-start gap-3 transition hover:border-brand-200 hover:shadow-md"
              >
                <ExternalLink className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <p className="font-medium text-slate-900">{r.title}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{r.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="card border-red-100 bg-red-50/50">
          <div className="flex items-start gap-3">
            <Trash2 className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <h2 className="font-semibold text-slate-900">Delete my data</h2>
              <p className="mt-1 text-sm text-slate-600">
                Remove all stored lease data from this browser. This action cannot be undone.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Delete all your MoveMate data? This cannot be undone.')) {
                    clearData();
                  }
                }}
                className="mt-3 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
              >
                Delete my data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
