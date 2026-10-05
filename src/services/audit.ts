/**
 * Who looked at what. Sensitive views (like revealing an SSN) are logged so there
 * is always a record. Demo: kept in this browser. Live: written server-side.
 */
export interface AuditEntry {
  applicationId: string;
  actor: string;
  action: string;
  at: string;
}

const KEY = "propel.demo.audit.v1";

function read(): AuditEntry[] {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as AuditEntry[]) : [];
}

export const auditService = {
  async log(applicationId: string, actor: string, action: string): Promise<void> {
    localStorage.setItem(KEY, JSON.stringify([{ applicationId, actor, action, at: new Date().toISOString() }, ...read()]));
  },
  async list(applicationId: string): Promise<AuditEntry[]> {
    return read().filter((entry) => entry.applicationId === applicationId);
  },
};
