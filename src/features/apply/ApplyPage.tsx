import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckList, Container, PageHeader } from "@/components/ui";
import { ApplyWizard } from "./ApplyWizard";
import { clearDraft, loadDraft, type Draft } from "./draft";
import { STEPS } from "./steps";

const BEFORE_YOU_START = [
  "Your CDL number and the state that issued it",
  "Addresses for the past 3 years",
  "Employers for the past 3 years, with a contact person and phone number",
  "Any accidents or traffic convictions from the past 3 years",
  "Your Social Security number",
] as const;

function Intro({ draft, onStart }: { draft: Draft | null; onStart: (resume: Draft | null) => void }) {
  return (
    <>
      <PageHeader eyebrow="Driver application" title="Apply to drive for Propel" intro="One short section at a time. About 15 to 20 minutes, and it saves as you go." />
      <section className="py-14">
        <Container className="max-w-3xl">
          <div className="card">
            <h2 className="display text-2xl">Before you start, have these handy</h2>
            <div className="mt-5">
              <CheckList items={BEFORE_YOU_START} />
            </div>
            <p className="mt-6 text-sm opacity-65">
              We ask for what federal rules (49 CFR 391.21) require of every commercial driver application. Your information is used only to evaluate your application. See our{" "}
              <Link to="/privacy" className="font-semibold text-brand underline">
                privacy policy
              </Link>
              .
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {draft ? (
                <>
                  <button type="button" className="btn btn-primary" onClick={() => onStart(draft)}>
                    Pick up where I left off (step {Math.min(draft.step + 1, STEPS.length)})
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      clearDraft();
                      onStart(null);
                    }}
                  >
                    Start over
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-primary" onClick={() => onStart(null)}>
                  Start my application
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export function ApplyPage() {
  const [draft] = useState(loadDraft);
  const [session, setSession] = useState<{ resume: Draft | null } | null>(null);
  if (!session) return <Intro draft={draft} onStart={(resume) => setSession({ resume })} />;
  return <ApplyWizard initial={session.resume} />;
}
