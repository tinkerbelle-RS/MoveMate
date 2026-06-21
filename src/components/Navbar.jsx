import { Link, useLocation } from 'react-router-dom';
import { HelpCircle, Home, LayoutDashboard, Trash2, Upload } from 'lucide-react';
import { useLease } from '../context/LeaseContext';

export default function Navbar() {
  const { lease, clearData } = useLease();
  const location = useLocation();
  const inDashboard = location.pathname === '/dashboard';

  if (inDashboard) return null;

  const linkClass = (path) => `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${location.pathname === path ? 'bg-gradient-to-br from-brand-600 to-accent-600 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`;

  return (
    <header className="no-print sticky top-0 z-50 border-b border-slate-200 bg-canvas/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 text-white shadow-sm">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-950">MoveMate</span>
            <span className="hidden text-xs text-slate-500 sm:block">Student lease workspace</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {lease && <Link to="/dashboard" className={linkClass('/dashboard')}><LayoutDashboard className="h-4 w-4" /><span className="hidden sm:inline">Dashboard</span></Link>}
          <Link to="/" className={linkClass('/')}><Upload className="h-4 w-4" /><span className="hidden sm:inline">Upload</span></Link>
          <Link to="/help" className={linkClass('/help')}><HelpCircle className="h-4 w-4" /><span className="hidden sm:inline">Help</span></Link>
          {lease && (
            <button
              onClick={() => { if (window.confirm('Delete all your MoveMate data? This cannot be undone.')) clearData(); }}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              title="Delete my data"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
