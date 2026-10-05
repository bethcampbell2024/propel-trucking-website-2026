import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { DEMO_MODE } from "@/data/company";
import { authService, DEMO_PASSWORD } from "@/services/auth";
import { AuthCard, ErrorNote, PasswordInput } from "./AuthCard";

const DEMO_LOGINS = [
  { label: "Marc (admin)", email: "mc@propeltrucking.com" },
  { label: "Kara (staff)", email: "kh@propeltrucking.com" },
];

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (authService.currentUser()) return <Navigate to="/admin/applicants" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const user = await authService.signIn(email, password);
    setBusy(false);
    if (user) navigate("/admin/applicants");
    else setError("That email and password don't match. If you can't remember yours, use \"Forgot password\".");
  };

  return (
    <AuthCard title="Staff portal" lead="Review driver applications. Sign in with your email and password.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold">
            Email
          </label>
          <input id="login-email" type="email" className="input" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <PasswordInput id="login-password" label="Password" value={password} onChange={setPassword} autoComplete="current-password" />
        {error && <ErrorNote>{error}</ErrorNote>}
        <button type="submit" className="btn btn-dark w-full" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-center text-sm">
          <Link to="/admin/forgot" className="font-semibold text-brand hover:underline">
            Forgot password?
          </Link>
        </p>
      </form>

      {DEMO_MODE && (
        <div className="mt-6 rounded-lg border border-dashed border-ink/25 p-3 text-xs">
          <p className="font-bold">Demo logins (password for both: {DEMO_PASSWORD})</p>
          <div className="mt-2 flex gap-2">
            {DEMO_LOGINS.map((login) => (
              <button
                key={login.email}
                type="button"
                className="cursor-pointer rounded border border-ink/20 px-3 py-1.5 font-semibold hover:bg-ink/5"
                onClick={() => {
                  setEmail(login.email);
                  setPassword(DEMO_PASSWORD);
                }}
              >
                {login.label}
              </button>
            ))}
          </div>
          <p className="mt-2 opacity-60">Demo only. Don't type a real password into this demo.</p>
        </div>
      )}
    </AuthCard>
  );
}
