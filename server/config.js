const PLACEHOLDER_KEYS = new Set(['', 'your_api_key_here', 'sk-ant-api03-xxx']);

export function getAnthropicApiKey() {
  const key = (process.env.ANTHROPIC_API_KEY || '').trim();
  if (!key || PLACEHOLDER_KEYS.has(key)) {
    return null;
  }
  return key;
}

export function isLiveAiEnabled() {
  return Boolean(getAnthropicApiKey());
}
