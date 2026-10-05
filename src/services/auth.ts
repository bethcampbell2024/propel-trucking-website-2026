import { hashPassword, verifyPassword, type PasswordHash } from "@/lib/password";

/**
 * Staff accounts for the portal: email + password, an admin role that manages the team,
 * invite links for new people, and reset links for forgotten passwords.
 *
 * This file is the seam. Today it runs in the browser (demo). For launch it is replaced by
 * Firebase Authentication plus a small server function for the admin-only actions; the
 * rest of the app only talks to `authService`.
 */
export type Role = "admin" | "staff";
export const ROLE_LABELS: Record<Role, string> = { admin: "Admin", staff: "Staff" };

export interface StaffUser {
  email: string;
  name: string;
  role: Role;
  /** "invited" until the person opens their link and sets a password. */
  status: "invited" | "active";
  addedAt: string;
}

/** The email that would be sent. The demo shows it on screen instead of sending it. */
export interface EmailPreview {
  to: string;
  subject: string;
  body: string;
  /** Absolute link, as it appears in the email. */
  link: string;
  /** Same link as an in-app path, for the demo's click-through. */
  path: string;
}

export type TokenKind = "invite" | "reset";
export interface TokenInfo {
  kind: TokenKind;
  email: string;
  name: string;
}

export interface AuthService {
  currentUser(): StaffUser | null;
  signIn(email: string, password: string): Promise<StaffUser | null>;
  signOut(): void;
  listUsers(): Promise<StaffUser[]>;
  /** Admin only. Adds the person and "sends" them a link to create their password. */
  inviteUser(input: { email: string; name: string; role: Role }): Promise<EmailPreview>;
  resendInvite(email: string): Promise<EmailPreview>;
  /** Admin only. You cannot remove yourself. */
  removeUser(email: string): Promise<void>;
  /** Null when the email is not on the team (the screen never reveals which). */
  requestPasswordReset(email: string): Promise<EmailPreview | null>;
  lookupToken(token: string): Promise<TokenInfo | null>;
  /** Sets the password from an invite or reset link and returns the (now active) user. */
  completeToken(token: string, password: string): Promise<StaffUser | null>;
}

interface StoredUser extends StaffUser {
  password?: PasswordHash;
}
interface StoredToken {
  token: string;
  email: string;
  kind: TokenKind;
  expiresAt: number;
}

export const DEMO_PASSWORD = "propel-demo-1";
const USERS_KEY = "propel.demo.users.v1";
const TOKENS_KEY = "propel.demo.tokens.v1";
const SESSION_KEY = "propel.demo.session.v2";
const HOUR = 3_600_000;
const EXPIRY: Record<TokenKind, number> = { invite: 7 * 24 * HOUR, reset: HOUR };

const normalize = (email: string) => email.trim().toLowerCase();
const publicUser = ({ password: _password, ...user }: StoredUser): StaffUser => user;

async function readUsers(): Promise<StoredUser[]> {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return JSON.parse(raw) as StoredUser[];
  const now = new Date().toISOString();
  const seeded: StoredUser[] = [
    { email: "mc@propeltrucking.com", name: "Marc", role: "admin", status: "active", addedAt: now, password: await hashPassword(DEMO_PASSWORD) },
    { email: "kh@propeltrucking.com", name: "Kara", role: "staff", status: "active", addedAt: now, password: await hashPassword(DEMO_PASSWORD) },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
  return seeded;
}

const writeUsers = (users: StoredUser[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
const readTokens = (): StoredToken[] => JSON.parse(localStorage.getItem(TOKENS_KEY) ?? "[]");
const writeTokens = (tokens: StoredToken[]) => localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));

function requireAdmin(): StaffUser {
  const me = localAuth.currentUser();
  if (me?.role !== "admin") throw new Error("Only an admin can do that.");
  return me;
}

/** One live link per person: issuing a new one cancels the old. */
function issueToken(user: StaffUser, kind: TokenKind): EmailPreview {
  const token = crypto.randomUUID();
  writeTokens([...readTokens().filter((t) => t.email !== user.email), { token, email: user.email, kind, expiresAt: Date.now() + EXPIRY[kind] }]);
  const path = `/admin/set-password/${token}`;
  const link = `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;
  const inviter = localAuth.currentUser()?.name ?? "Propel";
  const copy =
    kind === "invite"
      ? {
          subject: "You're invited to the Propel Trucking staff portal",
          body: `Hi ${user.name},\n\n${inviter} added you to the Propel Trucking staff portal. Use the link below to create your password. It works for 7 days.`,
        }
      : {
          subject: "Reset your Propel Trucking staff portal password",
          body: `Hi ${user.name},\n\nUse the link below to choose a new password. It works for 1 hour. If you didn't ask for this, you can ignore this email.`,
        };
  return { to: user.email, ...copy, link, path };
}

const localAuth: AuthService = {
  currentUser() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StaffUser) : null;
  },

  async signIn(email, password) {
    const user = (await readUsers()).find((u) => u.email === normalize(email));
    // Same answer for "no such person", "no password yet" and "wrong password".
    if (!user || user.status !== "active" || !user.password || !(await verifyPassword(password, user.password))) return null;
    const session = publicUser(user);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  signOut() {
    sessionStorage.removeItem(SESSION_KEY);
  },

  async listUsers() {
    return (await readUsers()).map(publicUser);
  },

  async inviteUser({ email, name, role }) {
    requireAdmin();
    const key = normalize(email);
    const users = await readUsers();
    if (users.some((u) => u.email === key)) throw new Error("That email is already on the team.");
    const user: StoredUser = { email: key, name: name.trim() || key.split("@")[0], role, status: "invited", addedAt: new Date().toISOString() };
    writeUsers([...users, user]);
    return issueToken(user, "invite");
  },

  async resendInvite(email) {
    requireAdmin();
    const user = (await readUsers()).find((u) => u.email === normalize(email));
    if (!user) throw new Error("That person is no longer on the team.");
    return issueToken(user, user.status === "invited" ? "invite" : "reset");
  },

  async removeUser(email) {
    const me = requireAdmin();
    const key = normalize(email);
    // Only admins get here and nobody can remove themselves, so an admin always remains.
    if (key === me.email) throw new Error("You can't remove yourself.");
    writeUsers((await readUsers()).filter((u) => u.email !== key));
    writeTokens(readTokens().filter((t) => t.email !== key));
  },

  async requestPasswordReset(email) {
    const user = (await readUsers()).find((u) => u.email === normalize(email));
    return user ? issueToken(user, user.status === "invited" ? "invite" : "reset") : null;
  },

  async lookupToken(token) {
    const stored = readTokens().find((t) => t.token === token && t.expiresAt > Date.now());
    const user = stored && (await readUsers()).find((u) => u.email === stored.email);
    return stored && user ? { kind: stored.kind, email: user.email, name: user.name } : null;
  },

  async completeToken(token, password) {
    const stored = readTokens().find((t) => t.token === token && t.expiresAt > Date.now());
    if (!stored) return null;
    const users = await readUsers();
    const user = users.find((u) => u.email === stored.email);
    if (!user) return null;
    const updated: StoredUser = { ...user, status: "active", password: await hashPassword(password) };
    writeUsers(users.map((u) => (u.email === user.email ? updated : u)));
    writeTokens(readTokens().filter((t) => t.token !== token));
    return publicUser(updated);
  },
};

export const authService: AuthService = localAuth;
