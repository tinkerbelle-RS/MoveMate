import { Link, useLocation } from 'react-router-dom';
import { Home, HelpCircle, Trash2 } from 'lucide-react';
import { useLease } from '../context/LeaseContext';

export default function Navbar() {
  const { lease, clearData } = useLease();
  const location = useLocation();

  const linkClass = (path) =>
    `text-sm font-medium transition ${
      location.pathname === path ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Home className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-slate-900">MoveMate</span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link to="/dashboard" className={linkClass('/dashboard')}>
            Dashboard
          </Link>
          <Link to="/" className={linkClass('/')}>
            Upload new lease
          </Link>
          <Link to="/help" className={linkClass('/help')}>
            <span className="hidden sm:inline">Help & legal resources</span>
            <HelpCircle className="h-5 w-5 sm:hidden" />
          </Link>
          {lease && (
            <button
              onClick={() => {
                if (window.confirm('Delete all your MoveMate data? This cannot be undone.')) {
                  clearData();
                }
              }}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
              title="Delete my data"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete my data</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
