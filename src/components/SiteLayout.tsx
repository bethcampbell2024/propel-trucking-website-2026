import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ADDRESS_LINE, COMPANY, DEMO_MODE, NAV_LINKS, asset } from "@/data/company";
import { ButtonLink, Container, Icon } from "@/components/ui";
import { cx } from "@/lib/cx";

export function Logo({ className = "h-11", city = false }: { className?: string; city?: boolean }) {
  return <img src={asset(city ? "images/logo-with-city.png" : "images/logo-oval.png")} alt="Propel Trucking, Inc." className={cx("w-auto", className)} />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function DemoBanner() {
  return (
    <div className="no-print bg-brand px-4 py-1.5 text-center text-xs font-semibold tracking-wide text-white">
      DEMO PREVIEW · sample content · nothing you enter here leaves this device
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cx("rounded-md px-3 py-2 text-sm font-semibold transition hover:text-white", isActive ? "text-white" : "text-white/65");

  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/10 bg-ink/95 text-white backdrop-blur">
      <Container className="flex h-[4.25rem] items-center justify-between">
        <Link to="/" aria-label="Propel Trucking home">
          <Logo className="h-11" />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          <ButtonLink to="/apply" className="ml-3 !px-5 !py-2 text-sm">
            Apply now
          </ButtonLink>
        </nav>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-lg border border-white/20 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon path={open ? "M5 5l14 14M19 5L5 19" : "M3 6h18M3 12h18M3 18h18"} className="h-6 w-6" />
        </button>
      </Container>
      {open && (
        <nav className="border-t border-white/10 bg-ink px-5 pb-5 lg:hidden" aria-label="Mobile">
          <div className="flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => cx(linkClass({ isActive }), "py-3 text-base")}>
                {link.label}
              </NavLink>
            ))}
          </div>
          <ButtonLink to="/apply" className="w-full">
            Apply now
          </ButtonLink>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="no-print bg-ink text-white/70">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo city className="h-24" />
          <p className="mt-5 max-w-xs text-sm">A family-run trucking company, started in Russellville, Arkansas by Marc Campbell.</p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold tracking-widest text-white uppercase">Explore</h3>
          <ul className="space-y-2 text-sm">
            {[...NAV_LINKS, { to: "/apply", label: "Apply to drive" }, { to: "/privacy", label: "Privacy policy" }].map((link) => (
              <li key={link.to}>
                <Link className="hover:text-white" to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-sm">
          <h3 className="mb-3 text-sm font-bold tracking-widest text-white uppercase">Find us</h3>
          <address className="space-y-1 not-italic">
            <p>{COMPANY.address.street}</p>
            <p>
              {COMPANY.address.city}, {COMPANY.address.state} {COMPANY.address.zip}
            </p>
            <p className="pt-2">
              Phone:{" "}
              <a className="hover:text-white" href={COMPANY.phoneHref}>
                {COMPANY.phone}
              </a>
            </p>
            <p>Fax: {COMPANY.fax}</p>
            <p className="pt-2 font-semibold text-white">USDOT {COMPANY.usdot}</p>
          </address>
        </div>
      </Container>
      <div className="border-t border-white/10 py-5 text-xs">
        <Container className="flex flex-col justify-between gap-2 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {COMPANY.legalName} · Equal opportunity employer · {ADDRESS_LINE}
          </p>
          {DEMO_MODE && (
            <Link className="hover:text-white" to="/admin">
              Staff portal (demo)
            </Link>
          )}
        </Container>
      </div>
    </footer>
  );
}

export function SiteLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <ScrollToTop />
      {DEMO_MODE && <DemoBanner />}
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
