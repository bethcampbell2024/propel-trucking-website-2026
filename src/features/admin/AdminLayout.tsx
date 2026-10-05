import { Link, Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "@/components/SiteLayout";
import { cx } from "@/lib/cx";
import { authService, ROLE_LABELS } from "@/services/auth";

/** Frame for every staff page. Anyone not signed in is sent back to the sign-in screen. */
export function AdminLayout() {
  const user = authService.currentUser();
  const navigate = useNavigate();
  if (!user) return <Navigate to="/admin" replace />;

  const linkClass = ({ isActive }: { isActive: boolean }) => cx("rounded-md px-3 py-2 text-sm font-semibold", isActive ? "bg-white/15 text-white" : "text-white/65 hover:text-white");

  return (
    <div className="min-h-svh bg-paper">
      <div className="no-print bg-brand px-4 py-1.5 text-center text-xs font-semibold text-white">DEMO STAFF PORTAL · sample applicants only</div>
      <header className="no-print bg-ink text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-6">
            <Link to="/" aria-label="Back to the website">
              <Logo className="h-9" />
            </Link>
            <nav className="flex gap-1">
              <NavLink to="/admin/applicants" className={linkClass}>
                Applicants
              </NavLink>
              {user.role === "admin" && (
                <NavLink to="/admin/team" className={linkClass}>
                  Team
                </NavLink>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-white/65 sm:inline">
              {user.name} · {ROLE_LABELS[user.role]}
            </span>
            <button
              type="button"
              className="cursor-pointer rounded-md border border-white/25 px-3 py-1.5 font-semibold hover:bg-white/10"
              onClick={() => {
                authService.signOut();
                navigate("/admin");
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  );
}
