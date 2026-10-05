import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cx } from "@/lib/cx";

/** Minimal inline SVG icon: one stroked path, inherits the text colour. */
export function Icon({ path, className = "h-5 w-5", strokeWidth = 2 }: { path: string; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

const TONES = { light: "bg-paper text-ink", white: "bg-white text-ink", dark: "bg-ink text-white" } as const;

export function Section({ tone = "light", className, children }: { tone?: keyof typeof TONES; className?: string; children: ReactNode }) {
  return (
    <section className={cx("py-16 sm:py-24", TONES[tone], className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, intro, center }: { eyebrow?: string; title: string; intro?: ReactNode; center?: boolean }) {
  return (
    <div className={cx("mb-10 max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="display text-3xl sm:text-5xl">{title}</h2>
      {intro && <p className="mt-4 text-lg leading-relaxed opacity-75">{intro}</p>}
    </div>
  );
}

const VARIANTS = { primary: "btn-primary", dark: "btn-dark", ghost: "btn-ghost", outline: "btn-outline" } as const;

interface ButtonLinkProps {
  variant?: keyof typeof VARIANTS;
  className?: string;
  children: ReactNode;
  to?: string;
  href?: string;
}

/** Internal route link (`to`) or external anchor (`href`) styled as a button. */
export function ButtonLink({ variant = "primary", className, children, to, href }: ButtonLinkProps) {
  const classes = cx("btn", VARIANTS[variant], className);
  if (href) {
    return (
      <a className={classes} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={classes} to={to ?? "/"}>
      {children}
    </Link>
  );
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <header className="bg-ink pt-16 pb-14 text-white sm:pt-24 sm:pb-20">
      <Container>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="display max-w-3xl text-4xl sm:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{intro}</p>}
      </Container>
    </header>
  );
}

export function CheckList({ items, tone = "light" }: { items: readonly string[]; tone?: "light" | "dark" }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className={cx("mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white", tone === "dark" ? "bg-white/20" : "bg-brand")}>
            <Icon path="M4 10.5l4 4 8-9" className="h-3 w-3" strokeWidth={3} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Media + copy row that flips sides; used wherever we describe a service or story. */
export function FeatureRow({
  eyebrow,
  title,
  body,
  bullets,
  media,
  flip,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets?: readonly string[];
  media: ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <div className={cx("overflow-hidden rounded-2xl shadow-xl ring-1 ring-ink/10", flip && "md:order-2")}>{media}</div>
      <div>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h3 className="display text-3xl sm:text-4xl">{title}</h3>
        <p className="mt-4 text-lg leading-relaxed opacity-75">{body}</p>
        {bullets && (
          <div className="mt-6">
            <CheckList items={bullets} />
          </div>
        )}
      </div>
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="bg-brand py-14 text-white">
      <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="display text-3xl sm:text-4xl">Ready to roll with Propel?</h2>
          <p className="mt-2 text-white/85">The online application takes about 15–20 minutes and saves as you go.</p>
        </div>
        <ButtonLink to="/apply" variant="dark">
          Apply to drive
        </ButtonLink>
      </Container>
    </section>
  );
}
