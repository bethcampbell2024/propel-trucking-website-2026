import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { DEMO_MODE } from "@/data/company";
import { authService, type EmailPreview } from "@/services/auth";
import { AuthCard } from "./AuthCard";
import { EmailPreviewCard } from "./EmailPreviewCard";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [preview, setPreview] = useState<EmailPreview | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPreview(await authService.requestPasswordReset(email));
    setSent(true);
  };

  return (
    <AuthCard title="Forgot password?" lead="Enter your email and we'll send you a link to choose a new one.">
      {sent ? (
        <div className="space-y-4">
          <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
            If that email belongs to someone on the team, a link is on its way. It works for 1 hour.
          </p>
          {DEMO_MODE && (preview ? <EmailPreviewCard preview={preview} /> : <p className="text-xs opacity-60">Demo note: that email isn't on the team, so nothing would be sent.</p>)}
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-semibold">
              Email
            </label>
            <input id="forgot-email" type="email" className="input" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-dark w-full">
            Send me a link
          </button>
        </form>
      )}
      <p className="mt-5 text-center text-sm">
        <Link to="/admin" className="font-semibold text-brand hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthCard>
  );
}
