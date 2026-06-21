import 'dotenv/config';
import fetch from 'node-fetch';

const key = (process.env.ANTHROPIC_API_KEY || '').trim();

const res = await fetch('https://api.anthropic.com/v1/models', {
  headers: {
    'x-api-key': key,
    'anthropic-version': '2023-06-01',
  },
});
console.log('models list', res.status, (await res.text()).slice(0, 500));

const models = ['claude-sonnet-4-6', 'claude-sonnet-4-5', 'claude-haiku-4-5-20251001'];
for (const model of models) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 20,
      messages: [{ role: 'user', content: 'Reply OK' }],
    }),
  });
  console.log(model, r.status, (await r.text()).slice(0, 120));
}
