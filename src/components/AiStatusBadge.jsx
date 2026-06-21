import { useEffect, useState } from 'react';
import { Sparkles, FlaskConical } from 'lucide-react';

export default function AiStatusBadge() {
  const [status, setStatus] = useState({ loading: true, mode: 'demo' });

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus({ loading: false, mode: data.mode || 'demo' }))
      .catch(() => setStatus({ loading: false, mode: 'demo' }));
  }, []);

  if (status.loading) {
    return null;
  }

  const live = status.mode === 'live';

  return (
    <div
      className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        live ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
      }`}
    >
      {live ? <Sparkles className="h-3.5 w-3.5" /> : <FlaskConical className="h-3.5 w-3.5" />}
      {live ? 'Live AI connected' : 'Demo mode: add ANTHROPIC_API_KEY to .env'}
    </div>
  );
}
