import type { ApplicationData } from "./schema/application";

/**
 * Autosave so a driver can leave and come back. Lives in the browser only,
 * and deliberately never stores the SSN or the signature.
 */
const KEY = "propel.application.draft.v1";

export interface Draft {
  step: number;
  values: Partial<ApplicationData>;
  savedAt: string;
}

export function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

export function saveDraft(values: ApplicationData, step: number): void {
  const { ssn: _ssn, signature: _signature, ...safe } = values;
  try {
    localStorage.setItem(KEY, JSON.stringify({ step, values: safe, savedAt: new Date().toISOString() } satisfies Draft));
  } catch {
    // Storage full or blocked: autosave is a convenience, never a reason to fail.
  }
}

export function clearDraft(): void {
  localStorage.removeItem(KEY);
}
