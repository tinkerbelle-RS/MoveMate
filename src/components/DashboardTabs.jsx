export default function DashboardTabs({ activeTab, onChange }) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'goals', label: 'Lease fit for my life' },
    { id: 'compare', label: 'Compare leases' },
  ];

  return (
    <div className="mb-8 border-b border-slate-200">
      <nav className="-mb-px flex gap-1 overflow-x-auto sm:gap-4" aria-label="Dashboard tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`shrink-0 border-b-2 px-3 py-3 text-sm font-medium transition sm:px-1 ${
              activeTab === tab.id
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
