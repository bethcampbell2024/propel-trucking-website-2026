import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

const TONES = {
  info: "border-ink/15 bg-white text-ink/75",
  warn: "border-amber-400/60 bg-amber-50 text-amber-900",
  good: "border-emerald-500/40 bg-emerald-50 text-emerald-900",
} as const;

/** Small callout used for helper text and warnings inside steps. */
export function StepNote({ tone = "info", children }: { tone?: keyof typeof TONES; children: ReactNode }) {
  return <div className={cx("rounded-lg border px-4 py-3 text-sm leading-relaxed", TONES[tone])}>{children}</div>;
}
