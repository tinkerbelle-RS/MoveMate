import { BarChart3, FileText, GitCompare, HelpCircle, Target } from 'lucide-react';

export const DASHBOARD_TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'compare', label: 'Compare', icon: GitCompare },
  { id: 'report', label: 'Report', icon: FileText },
  { id: 'help', label: 'Help', icon: HelpCircle },
];

export default function DashboardTabs({ activeTab, onChange, variant = 'top' }) {
  const base = variant === 'side'
    ? 'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition'
    : 'inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm';

  return (
    <nav
      className={variant === 'side' ? 'space-y-1' : 'grid grid-cols-5 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm'}
      aria-label="Dashboard sections"
    >
      {DASHBOARD_TABS.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`${base} ${
              active
                ? 'bg-brand-700 text-white shadow-sm'
                : variant === 'side'
                  ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className={variant === 'side' ? '' : 'truncate'}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
