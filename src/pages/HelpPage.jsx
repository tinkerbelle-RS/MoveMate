import { AlertCircle, ExternalLink, Lock, Shield, Trash2 } from 'lucide-react';
import { useLease } from '../context/LeaseContext';

const resources = [
  { title: 'UC Berkeley Student Legal Services', url: 'https://sa.berkeley.edu/legal', description: 'Campus legal support for Berkeley students, including housing questions.' },
  { title: 'UC Berkeley Basic Needs Center', url: 'https://basicneeds.berkeley.edu/', description: 'Campus support for food, housing, financial, and stability needs.' },
  { title: 'Berkeley Rent Board', url: 'https://rentboard.berkeleyca.gov/', description: 'Local tenant resources, rent stabilization information, and housing forms.' },
  { title: 'U.S. Dept. of Housing: Tenant Rights', url: 'https://www.hud.gov/topics/rental_assistance/tenants', description: 'Federal overview of tenant rights and fair housing.' },
];

function BoundaryCard({ icon: Icon, title, items, tone = 'slate' }) {
  const styles = tone === 'amber' ? 'bg-amber-50 border-amber-100 text-amber-900' : 'bg-white border-slate-200 text-slate-700';
  return (
    <div className={`rounded-xl border p-5 shadow-sm ${styles}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/70"><Icon className="h-5 w-5" /></div>
        <h2 className="font-semibold text-slate-950">{title}</h2>
      </div>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

export default function HelpPage({ embedded = false }) {
  const { clearData } = useLease();

  return (
    <div className={embedded ? 'space-y-5' : 'mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8'}>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="eyebrow">Resource center</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Help, privacy, and legal resources</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">MoveMate helps students understand lease documents and organize next steps. It is not a lawyer, legal service, or dispute-resolution tool.</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <BoundaryCard icon={Shield} title="What MoveMate can do" items={['Extract and summarize key lease terms in plain language', 'Flag clauses that look unusual or strict for student housing', 'Generate move-in, during-lease, and move-out checklists', 'Mask obvious personal info before AI analysis']} />
        <BoundaryCard icon={AlertCircle} title="What MoveMate cannot do" tone="amber" items={['Provide legal advice or tell you what to do in a dispute', 'Guarantee accuracy. Always verify against your original lease.', 'Replace a qualified attorney or tenant advocate', 'Negotiate with your landlord on your behalf']} />
      </div>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="card">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-emerald-700" />
            <h2 className="font-semibold text-slate-950">Privacy controls</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">MoveMate stores prototype dashboard data in this browser. Delete local data before sharing your machine or after a demo.</p>
          <button type="button" onClick={() => { if (window.confirm('Delete all your MoveMate data? This cannot be undone.')) clearData(); }} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
            Delete my data
          </button>
        </div>

        <div className="card">
          <h2 className="font-semibold text-slate-950">External resources</h2>
          <div className="mt-4 space-y-3">
            {resources.map((r) => (
              <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50">
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>
                  <span className="block text-sm font-semibold text-slate-950">{r.title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">{r.description}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
