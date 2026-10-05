import { cx } from "@/lib/cx";
import { STATUS_LABELS, type ApplicationStatus } from "@/services/applications";

const COLORS: Record<ApplicationStatus, string> = {
  new: "bg-brand/10 text-brand",
  in_review: "bg-amber-100 text-amber-800",
  contacted: "bg-sky-100 text-sky-800",
  hired: "bg-emerald-100 text-emerald-800",
  not_a_fit: "bg-ink/10 text-ink/60",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={cx("inline-block rounded-full px-3 py-1 text-xs font-bold", COLORS[status])}>{STATUS_LABELS[status]}</span>;
}
