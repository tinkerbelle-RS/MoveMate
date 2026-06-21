import { useRef, useState } from 'react';
import { Upload, FileText, Loader2, GitCompare } from 'lucide-react';
import { useLease } from '../../context/LeaseContext';
import { extractTextFromPdf, maskPersonalInfo } from '../../lib/pdf';
import { fitBadgeClass } from '../../lib/goals';
import GoalSelector from '../goals/GoalSelector';

function FitCell({ summary, fit, isWinner }) {
  return (
    <td
      className={`px-4 py-3 text-sm ${
        isWinner ? 'bg-emerald-50/80 font-medium text-emerald-900' : 'text-slate-700'
      }`}
    >
      <span
        className={`mb-1 inline-block rounded-full border px-2 py-0.5 text-xs capitalize ${fitBadgeClass(fit)}`}
      >
        {fit} fit
      </span>
      <p className="leading-relaxed">{summary}</p>
    </td>
  );
}

export default function CompareTab() {
  const {
    lease,
    leaseB,
    saveLeaseB,
    priorityGoals,
    setPriorityGoals,
    compareResult,
    saveCompareResult,
    setError,
  } = useLease();

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
      if (text.trim().length < 50) {
        throw new Error('Could not extract enough text. Try pasting instead.');
      }
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
        body: JSON.stringify({
          analysisA: lease.analysis,
          analysisB: leaseB.analysis,
          priorityGoals,
          labelA: lease.fileName,
          labelB: leaseB.fileName,
        }),
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
    <div className="space-y-6">
      <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Which lease is better for me?</h2>
        <p className="mt-1 text-sm text-slate-600">
          Upload a second lease and MoveMate compares both against your goals, row by row.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card border-brand-200 bg-brand-50/30">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-600">Lease A</p>
          <p className="mt-1 font-semibold text-slate-900">{lease.fileName}</p>
          <p className="mt-0.5 text-xs text-slate-500">Your primary lease</p>
        </div>

        <div className="card">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Lease B</p>
          {leaseB ? (
            <>
              <p className="mt-1 font-semibold text-slate-900">{leaseB.fileName}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Analyzed {new Date(leaseB.analyzedAt).toLocaleDateString()}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-slate-600">Not uploaded yet</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-secondary !px-4 !py-2 text-xs"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Upload PDF
            </button>
            <button
              type="button"
              className="btn-secondary !px-4 !py-2 text-xs"
              disabled={uploading}
              onClick={() => setShowPaste(true)}
            >
              <FileText className="h-4 w-4" />
              Paste text
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      </div>

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin-slow" />
          Analyzing Lease B…
        </div>
      )}

      <GoalSelector selected={priorityGoals} onChange={setPriorityGoals} />

      <button
        type="button"
        className="btn-primary"
        disabled={!leaseB || comparing || uploading}
        onClick={runCompare}
      >
        {comparing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin-slow" />
            Comparing…
          </>
        ) : (
          <>
            <GitCompare className="h-5 w-5" />
            Compare leases
          </>
        )}
      </button>

      {localError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {localError}
        </div>
      )}

      {compareResult && (
        <div className="card overflow-hidden p-0">
          <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
            <h3 className="font-semibold text-slate-900">Goal-aware comparison</h3>
            <p className="mt-1 text-sm text-slate-600">{compareResult.recommendation}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-white">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Goal
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {compareResult.label_a || lease.fileName}
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {compareResult.label_b || leaseB?.fileName}
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareResult.rows.map((row) => (
                  <tr key={row.goal_id} className="border-b border-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{row.goal_label}</td>
                    <FitCell
                      summary={row.lease_a_summary}
                      fit={row.lease_a_fit}
                      isWinner={row.better === 'a'}
                    />
                    <FitCell
                      summary={row.lease_b_summary}
                      fit={row.lease_b_fit}
                      isWinner={row.better === 'b'}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showPaste && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="card w-full max-w-lg">
            <h3 className="font-semibold text-slate-900">Paste Lease B text</h3>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              rows={10}
              placeholder="Paste lease text here…"
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="btn-primary flex-1"
                disabled={uploading}
                onClick={() => {
                  if (pasteText.trim().length < 50) {
                    setLocalError('Paste at least 50 characters.');
                    return;
                  }
                  analyzeText(pasteText, 'Lease B (pasted)');
                }}
              >
                Analyze
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowPaste(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
