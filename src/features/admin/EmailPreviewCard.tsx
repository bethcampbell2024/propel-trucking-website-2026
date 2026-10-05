import { Link } from "react-router-dom";
import type { EmailPreview } from "@/services/auth";

/** Demo stand-in for a real email: shows what would be sent and lets you click the link. */
export function EmailPreviewCard({ preview }: { preview: EmailPreview }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-brand/40 bg-brand/5 p-4 text-left text-sm">
      <p className="text-xs font-bold tracking-widest text-brand uppercase">Demo: the email that would be sent</p>
      <dl className="mt-3 space-y-1">
        <div>
          <dt className="inline font-semibold">To: </dt>
          <dd className="inline">{preview.to}</dd>
        </div>
        <div>
          <dt className="inline font-semibold">Subject: </dt>
          <dd className="inline">{preview.subject}</dd>
        </div>
      </dl>
      <p className="mt-3 whitespace-pre-line">{preview.body}</p>
      <Link to={preview.path} className="btn btn-primary mt-4 !py-2 text-sm">
        Open the link
      </Link>
      <p className="mt-2 text-xs break-all opacity-50">{preview.link}</p>
    </div>
  );
}
