import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Home, Printer, ShieldCheck, Upload } from 'lucide-react';
import { useLease } from '../context/LeaseContext';
import DashboardTabs from '../components/DashboardTabs';
import AtAGlance from '../components/AtAGlance';
import KeyTerms from '../components/KeyTerms';
import { ActionPlans } from '../components/ActionPlans';
import GoalsTab from '../components/goals/GoalsTab';
import CompareTab from '../components/compare/CompareTab';
import HelpPage from './HelpPage';
import ReportTab from '../components/dashboard/ReportTab';
import { DashboardWidgetGrid, InsightSnapshot } from '../components/dashboard/DashboardWidgets';
import { formatDate } from '../lib/storage';
import { getChecklistStats, getDeadlineItems, getRiskTone } from '../lib/dashboardInsights';

export default function DashboardPage() {
  const { lease, priorityGoals, goalEvaluation, updateChecklist } = useLease();
  const [activeTab, setActiveTab] = useState('overview');

  if (!lease) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <FileText className="h-7 w-7 text-slate-400" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">No lease yet</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Upload or paste a lease to unlock your command center, checklists, goal fit, and printable report.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          <Upload className="h-5 w-5" />
          Upload your lease
        </Link>
      </div>
    );
  }

  const { analysis, checklists, fileName, analyzedAt } = lease;
  const risk = getRiskTone(analysis.overall_risk_level);
  const checklistStats = getChecklistStats(checklists);
  const nextDeadline = getDeadlineItems(analysis, checklists)[0];

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <aside className="no-print sticky top-5 hidden h-[calc(100vh-2.5rem)] w-72 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 text-white">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">MoveMate</p>
              <p className="text-xs text-slate-500">Lease workspace</p>
            </div>
          </Link>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="truncate text-sm font-semibold text-slate-950">{fileName}</p>
            <p className="mt-1 text-xs text-slate-500">Analyzed {new Date(analyzedAt).toLocaleDateString()}</p>
            <span className={`status-pill mt-3 ${risk.pill}`}>{risk.label}</span>
          </div>

          <div className="mt-5">
            <DashboardTabs activeTab={activeTab} onChange={setActiveTab} variant="side" />
          </div>

          <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <ShieldCheck className="h-4 w-4" />
              Privacy first
            </div>
            <p className="mt-1 text-xs leading-relaxed text-emerald-800/80">Lease text is masked before analysis and stored locally in this prototype.</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="no-print sticky top-0 z-40 -mx-4 mb-5 border-b border-slate-200 bg-canvas/95 px-4 py-3 backdrop-blur lg:hidden">
            <div className="mb-3 flex items-center justify-between gap-3">
              <Link to="/" className="flex items-center gap-2 font-bold text-slate-950">
                <Home className="h-5 w-5" />
                MoveMate
              </Link>
              <Link to="/" className="btn-secondary !min-h-0 !px-3 !py-2 text-xs">
                <Upload className="h-4 w-4" />
                New lease
              </Link>
            </div>
            <DashboardTabs activeTab={activeTab} onChange={setActiveTab} />
          </div>

          <section className="no-print mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-brand-100 bg-gradient-to-r from-brand-600 via-teal-500 to-accent-600 px-5 py-5 text-white sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Lease Command Center</p>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{fileName}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
                    <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />Analyzed {formatDate(analyzedAt)}</span>
                    <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" />Student-first summary, not legal advice</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to="/" className="btn-secondary !border-white/25 !bg-white/15 !text-white hover:!bg-white/25">
                    <Upload className="h-4 w-4" />
                    New lease
                  </Link>
                  <button type="button" onClick={() => setActiveTab('report')} className="btn-secondary !border-white/25 !bg-white !text-brand-800 hover:!bg-brand-50">
                    <Printer className="h-4 w-4" />
                    Report
                  </button>
                </div>
              </div>
            </div>
            <div className="grid gap-3 bg-gradient-to-r from-brand-50 via-white to-accent-50 px-5 py-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Risk level', risk.label],
                ['Checklist progress', `${checklistStats.done}/${checklistStats.total} tasks`],
                ['Next deadline', nextDeadline ? `${nextDeadline.label}` : 'No date found'],
                ['Goal fit', goalEvaluation ? `${goalEvaluation.overall_fit.toFixed(1)}/5 overall` : 'Not evaluated yet'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/80 bg-white/80 px-3 py-2 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <AtAGlance analysis={analysis} />
              <InsightSnapshot analysis={analysis} checklists={checklists} />
              <DashboardWidgetGrid analysis={analysis} checklists={checklists} />
              <KeyTerms analysis={analysis} />
              <ActionPlans checklists={checklists} onUpdate={updateChecklist} />
            </div>
          )}

          {activeTab === 'goals' && <GoalsTab />}
          {activeTab === 'compare' && <CompareTab />}
          {activeTab === 'report' && <ReportTab lease={lease} priorityGoals={priorityGoals} goalEvaluation={goalEvaluation} />}
          {activeTab === 'help' && <HelpPage embedded />}
        </main>
      </div>
    </div>
  );
}
