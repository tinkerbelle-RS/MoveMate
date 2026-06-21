import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileText, Lock, Upload, X } from 'lucide-react';
import { useLease } from '../context/LeaseContext';
import { extractTextFromPdf, maskPersonalInfo } from '../lib/pdf';
import ProcessingCard from '../components/ProcessingCard';
import AiStatusBadge from '../components/AiStatusBadge';

const sampleLeaseText = `SAMPLE STUDENT LEASE FOR DEMO ONLY
Lease term: August 15, 2025 through July 31, 2026.
Monthly rent: $1,250 due on the 1st day of each month.
Security deposit: $1,250 due at signing.
Late fee: If rent is not received by the 5th day of the month, tenant may owe a $75 late fee.
Utilities: Owner pays water and trash. Tenant pays electricity, gas, and internet.
Guests: Overnight guests are permitted for up to 14 consecutive days in a month. Longer stays require written approval.
Subletting: Tenant may not sublet or assign the unit without prior written approval from owner.
Early termination: If tenant ends the lease early, tenant may owe rent until a replacement tenant is approved and may forfeit part of the security deposit.
Move-out notice: Tenant must give 60 days written notice before lease end.`;

const trustItems = ['PII masking before AI', 'Local prototype storage', 'Demo mode available'];

function DashboardPreview() {
  const timeline = ['Lease starts', 'Notice deadline', 'Move-out'];
  const chips = ['Sublet fit', 'Deposit safety', 'Fee predictability'];

  return (
    <div className="relative">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent-200/60 blur-3xl" />
      <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-brand-200/70 blur-3xl" />
      <div className="relative rounded-2xl border border-brand-100 bg-white/95 p-4 shadow-2xl shadow-brand-900/10">
        <div className="rounded-xl bg-gradient-to-br from-brand-600 via-teal-500 to-accent-600 p-4 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Lease Command Center</p>
              <h2 className="mt-2 text-xl font-semibold">Student lease.pdf</h2>
            </div>
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">Live AI</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['$1,250 rent', '$1,250 deposit', '60-day notice'].map((item) => (
              <div key={item} className="rounded-lg bg-white/15 p-3 text-xs font-semibold text-white shadow-sm ring-1 ring-white/15">{item}</div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-brand-100 bg-gradient-to-r from-brand-50 to-accent-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-950">Rental readiness</span>
            <span className="font-bold text-brand-700">67%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white"><div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" /></div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] font-semibold text-slate-600">
            {timeline.map((item) => <span key={item} className="rounded-md bg-white/80 px-2 py-1 text-center">{item}</span>)}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Risk review</p>
            <p className="mt-2 text-sm font-semibold text-amber-900">Moderate risk</p>
            <p className="mt-1 text-xs text-amber-800/80">Subletting and early exit need review.</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Goal fit</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {chips.map((chip) => <span key={chip} className="rounded-full bg-brand-50 px-2 py-1 text-[11px] font-semibold text-brand-700">{chip}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { processing, setProcessing, setError, error, saveLease } = useLease();

  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);

  const analyzeLease = async (text, name) => {
    setProcessing(true);
    setError(null);
    setFileName(name);
    setProgress(10);

    try {
      const masked = maskPersonalInfo(text);
      setProgress(35);

      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 8, 85));
      }, 600);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leaseText: masked }),
      });

      clearInterval(progressInterval);
      setProgress(95);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Analysis failed. Please try again.');
      }

      const analysis = await res.json();
      setProgress(100);
      saveLease(name, analysis);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      if (name === 'Pasted lease text' || name === 'Sample student lease') {
        setShowPaste(true);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }

    try {
      setProcessing(true);
      setFileName(file.name);
      setProgress(5);
      const text = await extractTextFromPdf(file);
      setProgress(20);

      if (text.trim().length < 50) {
        throw new Error('Could not extract enough text from this PDF. Try pasting the lease text instead.');
      }

      await analyzeLease(text, file.name);
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  const handlePasteSubmit = () => {
    if (pasteText.trim().length < 50) {
      setError('Please paste at least 50 characters of lease text.');
      return;
    }
    setShowPaste(false);
    setError(null);
    analyzeLease(pasteText, pasteText === sampleLeaseText ? 'Sample student lease' : 'Pasted lease text');
  };

  if (processing) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <ProcessingCard fileName={fileName} progress={progress} />
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-200 bg-canvas">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              Student-first lease intelligence
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Turn a lease into a rental command center.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Upload or paste your lease to get key terms, risk signals, goal-fit analysis, deadlines, and move-in-to-move-out checklists in one polished workspace.
            </p>

            <AiStatusBadge />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" className="btn-primary w-full sm:w-auto" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-5 w-5" />
                Upload lease PDF
              </button>
              <button type="button" className="btn-secondary w-full sm:w-auto" onClick={() => { setShowPaste(true); setError(null); }}>
                <FileText className="h-5 w-5" />
                Paste lease text
              </button>
              <button type="button" className="btn-secondary w-full sm:w-auto" onClick={() => { setPasteText(sampleLeaseText); setShowPaste(true); setError(null); }}>
                Try sample
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {trustItems.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <DashboardPreview />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="section-heading mt-1">From lease text to action plan</h2>
          </div>
          <span className="brand-pill">Built for fast hackathon demos</span>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ['01', 'Upload', 'Add a PDF or paste text from a lease portal.'],
            ['02', 'Analyze', 'Extract money, dates, rules, risk, and uncertainty.'],
            ['03', 'Act', 'Track deadlines, checklists, notes, and next best actions.'],
            ['04', 'Compare', 'Score leases against student priorities before choosing.'],
          ].map(([step, title, text]) => (
            <div key={title} className="gradient-card">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white">{step}</span>
              <p className="mt-4 text-sm font-semibold text-slate-950">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {showPaste && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="card relative max-h-[90vh] w-full max-w-2xl overflow-y-auto p-0">
            <div className="border-b border-slate-200 px-5 py-4">
              <button type="button" onClick={() => setShowPaste(false)} className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold text-slate-950">Paste lease text</h2>
              <p className="mt-1 text-sm text-slate-600">Personal details will be masked before analysis.</p>
            </div>
            <div className="p-5">
              <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} placeholder="Paste your lease text here..." className="input-surface min-h-[260px] w-full resize-y" rows={12} />
              {error && showPaste && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button type="button" className="btn-primary flex-1" onClick={handlePasteSubmit}>Analyze lease</button>
                <button type="button" className="btn-secondary" onClick={() => setPasteText(sampleLeaseText)}>Use sample text</button>
                <button type="button" className="btn-secondary" onClick={() => setShowPaste(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && !showPaste && (
        <div className="mx-auto max-w-lg px-4 pb-16">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
            <p className="font-semibold text-red-900">Something went wrong</p>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
