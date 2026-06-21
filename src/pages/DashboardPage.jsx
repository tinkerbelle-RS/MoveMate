import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText } from 'lucide-react';
import { useLease } from '../context/LeaseContext';
import DashboardTabs from '../components/DashboardTabs';
import AtAGlance from '../components/AtAGlance';
import KeyTerms from '../components/KeyTerms';
import { ActionPlans } from '../components/ActionPlans';
import GoalsTab from '../components/goals/GoalsTab';
import CompareTab from '../components/compare/CompareTab';

export default function DashboardPage() {
  const { lease, updateChecklist } = useLease();
  const [activeTab, setActiveTab] = useState('overview');

  if (!lease) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <FileText className="mx-auto h-12 w-12 text-slate-300" />
        <h1 className="mt-4 text-xl font-semibold text-slate-900">No lease yet</h1>
        <p className="mt-2 text-sm text-slate-600">
          Upload your lease to see your personalized dashboard.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          <Upload className="h-5 w-5" />
          Upload your lease
        </Link>
      </div>
    );
  }

  const { analysis, checklists, fileName, analyzedAt } = lease;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Your lease dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            {fileName} · Analyzed {new Date(analyzedAt).toLocaleDateString()}
          </p>
        </div>
        <p className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
          MoveMate summarizes your lease. It does not provide legal advice.
        </p>
      </div>

      <DashboardTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div className="space-y-12">
          <AtAGlance analysis={analysis} />
          <KeyTerms analysis={analysis} />
          <ActionPlans checklists={checklists} onUpdate={updateChecklist} />
        </div>
      )}

      {activeTab === 'goals' && <GoalsTab />}
      {activeTab === 'compare' && <CompareTab />}
    </div>
  );
}
