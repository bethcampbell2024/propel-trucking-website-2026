/**
 * Salted PBKDF2 password hashing via the browser's built-in crypto.
 * Demo-grade: it stops a password sitting in storage as plain text. The live site
 * uses Firebase Authentication, which does all of this (and more) on Google's servers.
 */
export interface PasswordHash {
  salt: string;
  hash: string;
}

export const PASSWORD_MIN_LENGTH = 10;
const ITERATIONS = 150_000;

const toBase64 = (bytes: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const fromBase64 = (text: string) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

async function derive(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations: ITERATIONS }, key, 256);
}

export async function hashPassword(password: string): Promise<PasswordHash> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { salt: toBase64(salt.buffer as ArrayBuffer), hash: toBase64(await derive(password, salt)) };
}

export async function verifyPassword(password: string, stored: PasswordHash): Promise<boolean> {
  return toBase64(await derive(password, fromBase64(stored.salt))) === stored.hash;
}

/** Returns a plain-English problem with the password, or null when it is fine. */
export function passwordProblem(password: string): string | null {
  return password.length >= PASSWORD_MIN_LENGTH ? null : `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
}
