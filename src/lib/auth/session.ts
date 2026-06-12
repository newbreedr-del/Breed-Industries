/**
 * Breed Industries — Signed admin sessions
 *
 * Replaces the old "any cookie longer than 10 chars is valid" check.
 * Tokens are HMAC-SHA256 signed with SESSION_SECRET and carry an issue
 * timestamp, so they can be verified and expired without a database.
 *
 * Uses the Web Crypto API so the SAME code runs in:
 *   - Edge middleware (src/middleware.ts)
 *   - Node API routes (login, etc.)
 *
 * Set SESSION_SECRET in .env.local and Vercel (a long random string).
 */

const enc = new TextEncoder();
const dec = new TextDecoder();

const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    // Fail closed: never fall back to a guessable default.
    throw new Error('SESSION_SECRET is not set (must be a long random string)');
  }
  return secret;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function toB64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64Url(s: string): Uint8Array {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0;
  s += '='.repeat(pad);
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export interface SessionPayload {
  username: string;
  issuedAt: number;
}

/** Create a signed session token for a username. */
export async function issueSession(username: string): Promise<string> {
  const payload = JSON.stringify({ u: username, t: Date.now() });
  const body = toB64Url(enc.encode(payload));
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(), enc.encode(body));
  return `${body}.${toB64Url(new Uint8Array(sig))}`;
}

/** Verify a token; returns the payload or null if invalid/expired/forged. */
export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;

  let valid = false;
  try {
    valid = await crypto.subtle.verify('HMAC', await hmacKey(), fromB64Url(sig) as BufferSource, enc.encode(body));
  } catch {
    return null;
  }
  if (!valid) return null;

  try {
    const { u, t } = JSON.parse(dec.decode(fromB64Url(body)));
    if (typeof t !== 'number' || Date.now() - t > MAX_AGE_MS) return null;
    return { username: String(u), issuedAt: t };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = 'admin_session';
export const SESSION_MAX_AGE_SECONDS = MAX_AGE_MS / 1000;
