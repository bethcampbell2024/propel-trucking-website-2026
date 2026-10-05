import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { passwordProblem } from "@/lib/password";
import { useAsync } from "@/lib/useAsync";
import { authService } from "@/services/auth";
import { AuthCard, ErrorNote, PasswordInput } from "./AuthCard";

/** Landing page for both the "you're invited" and "reset your password" links. */
export function SetPassword() {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const { data: info } = useAsync(() => authService.lookupToken(token), [token]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  if (info === undefined) return <AuthCard title="One moment...">{null}</AuthCard>;

  if (info === null) {
    return (
      <AuthCard title="This link has expired" lead="Links only work for a limited time, and only once.">
        <Link to="/admin/forgot" className="btn btn-dark w-full">
          Get a new link
        </Link>
      </AuthCard>
    );
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const problem = passwordProblem(password) ?? (password !== confirm ? "The two passwords don't match." : null);
    if (problem) return setError(problem);
    const user = await authService.completeToken(token, password);
    if (!user || !(await authService.signIn(user.email, password))) return setError("Something went wrong. Please ask for a new link.");
    navigate("/admin/applicants");
  };

  const invite = info.kind === "invite";
  return (
    <AuthCard
      title={invite ? `Welcome, ${info.name}` : "Choose a new password"}
      lead={invite ? "Create a password to finish setting up your staff portal account." : `Setting a new password for ${info.email}.`}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <p className="rounded-lg bg-paper px-4 py-3 text-sm">
          Your sign-in email: <strong>{info.email}</strong>
        </p>
        <PasswordInput id="new-password" label="Password" value={password} onChange={setPassword} autoComplete="new-password" />
        <PasswordInput id="confirm-password" label="Type it again" value={confirm} onChange={setConfirm} autoComplete="new-password" />
        <p className="text-xs opacity-60">At least 10 characters. A few random words make a strong, easy-to-remember password.</p>
        {error && <ErrorNote>{error}</ErrorNote>}
        <button type="submit" className="btn btn-primary w-full">
          {invite ? "Create my account" : "Save new password"}
        </button>
      </form>
    </AuthCard>
  );
}
