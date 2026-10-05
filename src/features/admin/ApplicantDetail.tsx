import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApplicationSummary } from "@/features/apply/ApplicationSummary";
import { formatDate } from "@/lib/format";
import { useAsync } from "@/lib/useAsync";
import { applicationService, STATUS_LABELS, type ApplicationStatus } from "@/services/applications";
import { auditService } from "@/services/audit";
import { authService } from "@/services/auth";

export function ApplicantDetail() {
  const { id = "" } = useParams();
  const { data: application, reload } = useAsync(() => applicationService.get(id), [id]);
  const { data: log, reload: reloadLog } = useAsync(() => auditService.list(id), [id]);
  const [ssnRevealed, setSsnRevealed] = useState(false);

  if (application === undefined) return <p className="opacity-60">Loading...</p>;

  const { data } = application;

  const setStatus = async (status: ApplicationStatus) => {
    await applicationService.setStatus(id, status);
    reload();
  };

  const toggleSsn = async () => {
    if (!ssnRevealed) {
      await auditService.log(id, authService.currentUser()?.email ?? "unknown", "Viewed full Social Security number");
      reloadLog();
    }
    setSsnRevealed(!ssnRevealed);
  };

  return (
    <div className="space-y-6">
      <div className="no-print">
        <Link to="/admin/applicants" className="text-sm font-semibold text-brand hover:underline">
          Back to applicants
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="display text-4xl">
            {data.firstName} {data.lastName}
          </h1>
          <p className="mt-1 opacity-65">
            {data.position} · submitted {formatDate(application.submittedAt)} · ref {application.id}
          </p>
        </div>
        <div className="no-print flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold" htmlFor="status">
            Status
          </label>
          <select id="status" className="input !w-auto" value={application.status} onChange={(e) => setStatus(e.target.value as ApplicationStatus)}>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button type="button" className="btn btn-outline" onClick={() => window.print()}>
            Print / save as PDF
          </button>
        </div>
      </div>

      <div className="no-print flex flex-wrap items-center gap-3 rounded-xl border border-amber-400/50 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <span className="flex-1">The Social Security number is hidden by default. Revealing it is recorded in the access log below.</span>
        <button type="button" className="btn btn-dark !px-4 !py-2 text-sm" onClick={toggleSsn}>
          {ssnRevealed ? "Hide SSN" : "Reveal SSN"}
        </button>
      </div>

      <ApplicationSummary data={data} ssn={ssnRevealed ? "full" : "masked"} signedAt={application.submittedAt} />

      <section className="no-print rounded-xl bg-white p-5 ring-1 ring-ink/10">
        <h2 className="display mb-3 text-lg">Access log</h2>
        {log && log.length > 0 ? (
          <ul className="space-y-1 text-sm">
            {log.map((entry) => (
              <li key={entry.at}>
                <strong>{entry.actor}</strong>: {entry.action} <span className="opacity-50">({new Date(entry.at).toLocaleString()})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm opacity-55">Nobody has viewed sensitive fields on this application yet.</p>
        )}
      </section>
    </div>
  );
}
