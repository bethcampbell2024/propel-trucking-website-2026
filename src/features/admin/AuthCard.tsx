import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/SiteLayout";

/** The centered white card every signed-out portal screen (sign in, forgot, set password) sits in. */
export function AuthCard({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) {
  return (
    <div className="grid min-h-svh place-items-center bg-ink px-5 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <Logo className="mx-auto h-16" />
        <h1 className="display mt-6 text-center text-3xl">{title}</h1>
        {lead && <p className="mt-2 text-center text-sm opacity-65">{lead}</p>}
        <div className="mt-7">{children}</div>
        <p className="mt-6 text-center text-sm">
          <Link to="/" className="font-semibold text-brand hover:underline">
            Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}

export function PasswordInput({ id, label, value, onChange, autoComplete }: { id: string; label: string; value: string; onChange: (v: string) => void; autoComplete: string }) {
  const [shown, setShown] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        <input id={id} type={shown ? "text" : "password"} className="input pr-16" value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} />
        <button type="button" aria-pressed={shown} onClick={() => setShown(!shown)} className="absolute inset-y-0 right-3 cursor-pointer text-sm font-semibold text-brand">
          {shown ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-lg bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">
      {children}
    </p>
  );
}
