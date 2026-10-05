import { useState, type FormEvent } from "react";
import { formatDate } from "@/lib/format";
import { useAsync } from "@/lib/useAsync";
import { authService, ROLE_LABELS, type EmailPreview, type Role } from "@/services/auth";
import { cx } from "@/lib/cx";
import { ErrorNote } from "./AuthCard";
import { EmailPreviewCard } from "./EmailPreviewCard";

function Pill({ tone, children }: { tone: "ink" | "brand" | "amber" | "green"; children: string }) {
  const tones = { ink: "bg-ink/10 text-ink/70", brand: "bg-brand/10 text-brand", amber: "bg-amber-100 text-amber-800", green: "bg-emerald-100 text-emerald-800" };
  return <span className={cx("rounded-full px-2.5 py-0.5 text-xs font-bold", tones[tone])}>{children}</span>;
}

export function TeamPage() {
  const me = authService.currentUser();
  const { data: members, reload } = useAsync(() => authService.listUsers());
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("staff");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<EmailPreview | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  if (me?.role !== "admin") {
    return (
      <div className="max-w-xl space-y-3">
        <h1 className="display text-4xl">Team</h1>
        <p className="opacity-70">Only an admin can add or remove people. Ask Marc if you need someone added.</p>
      </div>
    );
  }

  /** Runs an admin action, shows any problem in plain English, and refreshes the list. */
  const attempt = async (action: () => Promise<void>) => {
    setError("");
    try {
      await action();
      reload();
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Something went wrong.");
    }
  };

  const invite = (event: FormEvent) => {
    event.preventDefault();
    if (!email.includes("@")) return setError("Enter a valid email address.");
    void attempt(async () => {
      setPreview(await authService.inviteUser({ email, name, role }));
      setEmail("");
      setName("");
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="display text-4xl">Team</h1>
        <p className="mt-2 opacity-70">
          Add someone by email and they get a link to create their own password. Forgot it later? They can reset it from the sign-in page.
        </p>
      </div>

      <form className="card grid gap-3 sm:grid-cols-[1.5fr_1fr_auto_auto] sm:items-end" onSubmit={invite} noValidate>
        <div>
          <label htmlFor="team-email" className="mb-1.5 block text-sm font-semibold">
            Email
          </label>
          <input id="team-email" type="email" className="input" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="team-name" className="mb-1.5 block text-sm font-semibold">
            Name <span className="font-normal opacity-50">(optional)</span>
          </label>
          <input id="team-name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="team-role" className="mb-1.5 block text-sm font-semibold">
            Role
          </label>
          <select id="team-role" className="input" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Send invite
        </button>
        <p className="text-xs opacity-60 sm:col-span-4">Staff can review applications. Admins can also add and remove people.</p>
      </form>

      {error && <ErrorNote>{error}</ErrorNote>}
      {preview && <EmailPreviewCard preview={preview} />}

      <ul className="divide-y divide-ink/10 rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
        {members?.map((member) => (
          <li key={member.email} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="flex flex-wrap items-center gap-2 font-semibold">
                {member.name}
                <Pill tone={member.role === "admin" ? "brand" : "ink"}>{ROLE_LABELS[member.role]}</Pill>
                {member.status === "invited" ? <Pill tone="amber">Invite pending</Pill> : <Pill tone="green">Active</Pill>}
                {member.email === me.email && <Pill tone="ink">You</Pill>}
              </p>
              <p className="text-sm opacity-60">
                {member.email} · added {formatDate(member.addedAt)}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm font-semibold">
              {member.status === "invited" && (
                <button type="button" className="cursor-pointer text-ink/70 hover:underline" onClick={() => attempt(async () => setPreview(await authService.resendInvite(member.email)))}>
                  Resend invite
                </button>
              )}
              {member.email !== me.email &&
                (confirming === member.email ? (
                  <span className="flex items-center gap-3">
                    <button
                      type="button"
                      className="cursor-pointer text-brand hover:underline"
                      onClick={() =>
                        attempt(async () => {
                          await authService.removeUser(member.email);
                          setConfirming(null);
                        })
                      }
                    >
                      Yes, remove {member.name}
                    </button>
                    <button type="button" className="cursor-pointer opacity-60 hover:underline" onClick={() => setConfirming(null)}>
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button type="button" className="cursor-pointer text-brand hover:underline" onClick={() => setConfirming(member.email)}>
                    Remove
                  </button>
                ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
