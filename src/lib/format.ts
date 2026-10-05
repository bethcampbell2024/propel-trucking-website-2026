const digitsOnly = (value: string) => value.replace(/\D/g, "");

export function formatPhone(value: string): string {
  const d = digitsOnly(value).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function formatSsn(value: string): string {
  const d = digitsOnly(value).slice(0, 9);
  if (d.length < 4) return d;
  if (d.length < 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
}

export const formatZip = (value: string): string => digitsOnly(value).slice(0, 5);

/** Show only the last four digits; used everywhere the full SSN should not appear. */
export function redactSsn(value: string): string {
  const d = digitsOnly(value);
  return d ? `***-**-${d.slice(-4)}` : "";
}

/** ISO yyyy-mm-dd to a readable date, without timezone drift. */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(`${iso.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
