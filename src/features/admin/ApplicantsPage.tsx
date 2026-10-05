import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/format";
import { useAsync } from "@/lib/useAsync";
import { applicationService, STATUS_LABELS, type ApplicationStatus } from "@/services/applications";
import { StatusBadge } from "./StatusBadge";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card !p-5">
      <p className="text-xs font-bold tracking-widest uppercase opacity-50">{label}</p>
      <p className="display mt-1 text-4xl">{value}</p>
    </div>
  );
}

export function ApplicantsPage() {
  const { data: applications } = useAsync(() => applicationService.list());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "all">("all");

  if (!applications) return <p className="opacity-60">Loading...</p>;

  const needle = query.trim().toLowerCase();
  const shown = applications.filter((a) => {
    const name = `${a.data.firstName} ${a.data.lastName} ${a.data.email} ${a.data.phone}`.toLowerCase();
    return (status === "all" || a.status === status) && name.includes(needle);
  });
  const count = (s: ApplicationStatus) => applications.filter((a) => a.status === s).length;

  return (
    <div className="space-y-6">
      <h1 className="display text-4xl">Applicants</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="New" value={count("new")} />
        <Stat label="In review" value={count("in_review")} />
        <Stat label="Total" value={applications.length} />
      </div>

      <div className="flex flex-wrap gap-3">
        <input className="input max-w-sm" placeholder="Search name, email or phone" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search applicants" />
        <select className="input max-w-48" value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus | "all")} aria-label="Filter by status">
          <option value="all">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-xs tracking-wide uppercase opacity-55">
            <tr>
              <th className="px-5 py-3">Applicant</th>
              <th className="px-5 py-3">Position</th>
              <th className="px-5 py-3">CDL exp.</th>
              <th className="px-5 py-3">Submitted</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((a) => (
              <tr key={a.id} className="border-b border-ink/5 last:border-0 hover:bg-paper">
                <td className="px-5 py-4">
                  <Link to={`/admin/applicants/${a.id}`} className="font-semibold text-ink hover:text-brand">
                    {a.data.firstName} {a.data.lastName}
                  </Link>
                  <p className="text-xs opacity-55">{a.data.email}</p>
                </td>
                <td className="px-5 py-4">{a.data.position}</td>
                <td className="px-5 py-4">{a.data.cdlYears} yrs</td>
                <td className="px-5 py-4">{formatDate(a.submittedAt)}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={a.status} />
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center opacity-55">
                  No applicants match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
