import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { analyzeLease } from './analyze.js';
import { getAnthropicApiKey, isLiveAiEnabled } from './config.js';
import { evaluateGoals, compareLeases } from './goals.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

if (existsSync(DIST)) {
  app.use(express.static(DIST));
}

app.get('/api/health', (_req, res) => {
  const live = isLiveAiEnabled();
  res.json({
    ok: true,
    mode: live ? 'live' : 'demo',
    hasApiKey: live,
    model: live ? process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6' : null,
  });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { leaseText } = req.body;

    if (!leaseText || typeof leaseText !== 'string' || leaseText.trim().length < 50) {
      return res.status(400).json({
        error: 'Please provide lease text with at least 50 characters.',
      });
    }

    const result = await analyzeLease(leaseText.trim());
    res.json(result);
  } catch (err) {
    console.error('Analyze error:', err.message);
    res.status(500).json({
      error: err.message || 'Something went wrong analyzing your lease.',
    });
  }
});

app.post('/api/evaluate-goals', async (req, res) => {
  try {
    const { analysis, priorityGoals } = req.body;

    if (!analysis || typeof analysis !== 'object') {
      return res.status(400).json({ error: 'Lease analysis is required.' });
    }

    const goals = Array.isArray(priorityGoals) ? priorityGoals : [];

    if (goals.length > 0 && goals.length < 2) {
      return res.status(400).json({ error: 'Select at least 2 goals, or leave empty to evaluate all.' });
    }

    if (goals.length > 3) {
      return res.status(400).json({ error: 'Select up to 3 priority goals.' });
    }

    const result = await evaluateGoals(analysis, goals);
    res.json(result);
  } catch (err) {
    console.error('Evaluate goals error:', err.message);
    res.status(500).json({ error: err.message || 'Could not evaluate lease fit.' });
  }
});

app.post('/api/compare-leases', async (req, res) => {
  try {
    const { analysisA, analysisB, priorityGoals, labelA, labelB } = req.body;

    if (!analysisA || !analysisB) {
      return res.status(400).json({ error: 'Both lease analyses are required.' });
    }

    const goals = Array.isArray(priorityGoals) ? priorityGoals : [];
    const result = await compareLeases(
      analysisA,
      analysisB,
      goals,
      labelA || 'Lease A',
      labelB || 'Lease B'
    );
    res.json(result);
  } catch (err) {
    console.error('Compare leases error:', err.message);
    res.status(500).json({ error: err.message || 'Could not compare leases.' });
  }
});

if (existsSync(DIST)) {
  app.get('*', (_req, res) => res.sendFile(join(DIST, 'index.html')));
}

app.listen(PORT, () => {
  const live = isLiveAiEnabled();
  console.log(`MoveMate API running on http://localhost:${PORT}`);
  console.log(live ? 'AI mode: live (Anthropic API connected)' : 'AI mode: demo (add ANTHROPIC_API_KEY to .env)');
  if (!live && getAnthropicApiKey() === null && process.env.ANTHROPIC_API_KEY) {
    console.log('Tip: ANTHROPIC_API_KEY looks unset or still uses the placeholder value.');
  }
});
