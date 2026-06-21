import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, X } from 'lucide-react';
import { useLease } from '../context/LeaseContext';
import { extractTextFromPdf, maskPersonalInfo } from '../lib/pdf';
import ProcessingCard from '../components/ProcessingCard';
import BenefitRow from '../components/BenefitRow';
import AiStatusBadge from '../components/AiStatusBadge';

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
      if (name === 'Pasted lease text') {
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
        throw new Error(
          'Could not extract enough text from this PDF. Try pasting the lease text instead.'
        );
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
    analyzeLease(pasteText, 'Pasted lease text');
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              MoveMate
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              MoveMate is a &ldquo;TurboTax for renting&rdquo; for students: upload your lease and
              get AI-powered lease intelligence, deposit protection, and move-in-to-move-out
              checklists in one place.
            </p>

            <AiStatusBadge />

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                className="btn-primary w-full sm:w-auto"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-5 w-5" />
                Upload your lease
              </button>
              <button
                type="button"
                className="btn-secondary w-full sm:w-auto"
                onClick={() => {
                  setShowPaste(true);
                  setError(null);
                }}
              >
                <FileText className="h-5 w-5" />
                Paste lease text instead
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            <p className="mt-6 text-xs text-slate-500">
              We process your lease to extract key information. We strip obvious identifiers and
              never sell your data.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <BenefitRow />
      </section>

      {/* Paste modal */}
      {showPaste && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="card relative max-h-[90vh] w-full max-w-lg overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowPaste(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-lg font-semibold text-slate-900">Paste lease text</h2>
            <p className="mt-1 text-sm text-slate-600">
              Copy and paste the text from your lease document. Personal details will be masked
              before analysis.
            </p>

            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste your lease text here…"
              className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
              rows={12}
            />

            {error && showPaste && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <div className="mt-4 flex gap-3">
              <button type="button" className="btn-primary flex-1" onClick={handlePasteSubmit}>
                Analyze lease
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowPaste(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mx-auto max-w-lg px-4 pb-16">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-800">Something went wrong</p>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setError(null);
                  fileInputRef.current?.click();
                }}
              >
                Try again
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setError(null);
                  setShowPaste(true);
                }}
              >
                Paste lease text manually
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
