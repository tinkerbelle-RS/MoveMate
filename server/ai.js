import fetch from 'node-fetch';
import { getAnthropicApiKey } from './config.js';

const DEFAULT_MODEL = 'claude-sonnet-4-6';

export async function callClaude(systemPrompt, userPrompt, maxTokens = 2048) {
  const apiKey = getAnthropicApiKey();
  if (!apiKey) {
    return null;
  }

  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  const body = await response.text();

  if (!response.ok) {
    let message = body;
    try {
      const parsed = JSON.parse(body);
      message = parsed?.error?.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const data = JSON.parse(body);
  return data.content?.find((block) => block.type === 'text')?.text ?? '';
}

export function parseJsonFromText(text) {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    // continue
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    return JSON.parse(fenced[1].trim());
  }

  const objectMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!objectMatch) {
    throw new Error('AI returned invalid response format');
  }

  return JSON.parse(objectMatch[0]);
}

export function isLiveAi() {
  return Boolean(getAnthropicApiKey());
}
