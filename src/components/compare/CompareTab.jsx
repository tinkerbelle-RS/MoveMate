import { useRef, useState } from 'react';
import { CheckCircle2, FileText, GitCompare, Loader2, Trophy, Upload, X } from 'lucide-react';
import { useLease } from '../../context/LeaseContext';
import { extractTextFromPdf, maskPersonalInfo } from '../../lib/pdf';
import { fitBadgeClass } from '../../lib/goals';
import GoalSelector from '../goals/GoalSelector';

function LeaseCard({ eyebrow, fileName, analyzedAt, active }) {
  return (
    <div className={`rounded-xl border p-5 ${active ? 'border-brand-300 bg-brand-50 text-slate-950' : 'border-slate-200 bg-white text-slate-950'}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${active ? 'text-brand-700' : 'text-slate-500'}`}>{eyebrow}</p>
      <p className="mt-2 truncate text-lg font-semibold">{fileName || 'Not uploaded yet'}</p>
      <p className={`mt-1 text-sm ${active ? 'text-brand-700' : 'text-slate-500'}`}>{analyzedAt ? `Analyzed ${new Date(analyzedAt).toLocaleDateString()}` : 'Upload or paste a second lease to compare.'}</p>
    </div>
  );
}

function FitCell({ summary, fit, isWinner }) {
  return (
    <td className={`min-w-[220px] px-4 py-4 align-top text-sm ${isWinner ? 'bg-emerald-50 text-emerald-950' : 'text-slate-700'}`}>
      <div className="flex items-center gap-2">
        <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${fitBadgeClass(fit)}`}>{fit} fit</span>
        {isWinner && <Trophy className="h-4 w-4 text-emerald-600" />}
      </div>
      <p className="mt-2 leading-relaxed">{summary}</p>
    </td>
  );
}

export default function CompareTab() {
  const { lease, leaseB, saveLeaseB, priorityGoals, setPriorityGoals, compareResult, saveCompareResult, setError } = useLease();
  const fileInputRef = useRef(null);
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [localError, setLocalError] = useState(null);

  const analyzeText = async (text, name) => {
    setUploading(true);
    setLocalError(null);
    try {
      const masked = maskPersonalInfo(text);
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leaseText: masked }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      saveLeaseB(name, data);
      setShowPaste(false);
      setPasteText('');
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFile = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setLocalError('Please upload a PDF file.');
      return;
    }
    try {
      setUploading(true);
      const text = await extractTextFromPdf(file);
      if (text.trim().length < 50) throw new Error('Could not extract enough text. Try pasting instead.');
      await analyzeText(text, file.name);
    } catch (err) {
      setLocalError(err.message);
      setUploading(false);
    }
  };

  const runCompare = async () => {
    if (!leaseB) {
      setLocalError('Upload Lease B first.');
      return;
    }
    setComparing(true);
    setLocalError(null);
    setError(null);
    try {
      const res = await fetch('/api/compare-leases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisA: lease.analysis, analysisB: leaseB.analysis, priorityGoals, labelA: lease.fileName, labelB: leaseB.fileName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Comparison failed');
      saveCompareResult(data);
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="eyebrow">Decision support</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Compare housing options</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">Upload a second lease and compare each option against the same student priorities.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LeaseCard eyebrow="Lease A" fileName={lease.fileName} analyzedAt={lease.analyzedAt} active />
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <LeaseCard eyebrow="Lease B" fileName={leaseB?.fileName} analyzedAt={leaseB?.analyzedAt} />
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn-secondary !min-h-0 !px-4 !py-2 text-xs" disabled={uploading} onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" />Upload PDF</button>
            <button type="button" className="btn-secondary !min-h-0 !px-4 !py-2 text-xs" disabled={uploading} onClick={() => setShowPaste(true)}><FileText className="h-4 w-4" />Paste text</button>
          </div>
          <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        </div>
      </div>

      {uploading && <div className="status-pill border-slate-200 bg-white text-slate-600"><Loader2 className="h-4 w-4 animate-spin-slow" />Analyzing Lease B</div>}

      <GoalSelector selected={priorityGoals} onChange={setPriorityGoals} />

      <button type="button" className="btn-primary" disabled={!leaseB || comparing || uploading} onClick={runCompare}>
        {comparing ? <><Loader2 className="h-5 w-5 animate-spin-slow" /> Comparing</> : <><GitCompare className="h-5 w-5" /> Compare leases</>}
      </button>

      {localError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{localError}</div>}

      {compareResult && (
        <div className="card overflow-hidden p-0">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div>
                <h3 className="font-semibold text-slate-950">Goal-aware recommendation</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{compareResult.recommendation}</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-white">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Goal</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{compareResult.label_a || lease.fileName}</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{compareResult.label_b || leaseB?.fileName}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {compareResult.rows.map((row) => (
                  <tr key={row.goal_id}>
                    <td className="px-4 py-4 align-top text-sm font-semibold text-slate-950">{row.goal_label}</td>
                    <FitCell summary={row.lease_a_summary} fit={row.lease_a_fit} isWinner={row.better === 'a'} />
                    <FitCell summary={row.lease_b_summary} fit={row.lease_b_fit} isWinner={row.better === 'b'} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showPaste && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="card relative w-full max-w-lg p-0">
            <div className="border-b border-slate-200 px-5 py-4">
              <button type="button" onClick={() => setShowPaste(false)} className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X className="h-5 w-5" /></button>
              <h3 className="font-semibold text-slate-950">Paste Lease B text</h3>
            </div>
            <div className="p-5">
              <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} className="input-surface min-h-[220px] w-full" rows={10} placeholder="Paste lease text here..." />
              <div className="mt-4 flex gap-2">
                <button type="button" className="btn-primary flex-1" disabled={uploading} onClick={() => { if (pasteText.trim().length < 50) { setLocalError('Paste at least 50 characters.'); return; } analyzeText(pasteText, 'Lease B (pasted)'); }}>Analyze</button>
                <button type="button" className="btn-secondary" onClick={() => setShowPaste(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
