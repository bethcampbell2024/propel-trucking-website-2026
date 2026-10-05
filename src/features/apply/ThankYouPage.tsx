import { useLocation } from "react-router-dom";
import { ButtonLink, Container, Icon } from "@/components/ui";
import { COMPANY, DEMO_MODE } from "@/data/company";

export function ThankYouPage() {
  const state = useLocation().state as { id?: string; firstName?: string } | null;
  return (
    <section className="py-20">
      <Container className="max-w-2xl text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand text-white">
          <Icon path="M4 12.5l5 5 11-12" className="h-8 w-8" strokeWidth={3} />
        </div>
        <h1 className="display mt-6 text-4xl sm:text-5xl">{state?.firstName ? `Thanks, ${state.firstName}.` : "Application received."}</h1>
        <p className="mt-4 text-lg opacity-75">
          {DEMO_MODE
            ? "Your application is in. In the live site, a confirmation email goes to you and the Propel team is notified. Our team then reviews it and reaches out if it looks like a fit."
            : "Your application is in. A confirmation email is on its way, and our team will review it and reach out if it looks like a fit."}
        </p>
        {state?.id && (
          <p className="mt-6 inline-block rounded-lg bg-white px-5 py-3 text-sm ring-1 ring-ink/10">
            Reference number: <strong className="font-mono">{state.id}</strong>
          </p>
        )}
        <p className="mt-6 text-sm opacity-65">
          Questions? Call us at{" "}
          <a className="font-semibold text-brand" href={COMPANY.phoneHref}>
            {COMPANY.phone}
          </a>
          .
        </p>
        <div className="mt-8">
          <ButtonLink to="/" variant="dark">
            Back to home
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
