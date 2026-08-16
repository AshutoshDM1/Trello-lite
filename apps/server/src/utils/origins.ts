function parseOrigins(raw?: string): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((url) => String(url).trim()).filter(Boolean);
      }
    } catch {
      // Fallback if not valid JSON
    }
  }
  return trimmed
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((url) => url.replace(/['"]/g, '').trim())
    .filter(Boolean);
}

const FrontendURL = parseOrigins(process.env.FRONTEND_URL);
const backendUrl = process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : [];

export const origins = Array.from(
  new Set([
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173',
    'http://localhost:6000',
    ...backendUrl,
    ...FrontendURL,
  ]),
);
