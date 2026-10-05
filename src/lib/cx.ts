/** Tiny className joiner so we don't need a dependency for it. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
