# Propel Trucking website (demo)

Informational site for Propel Trucking, Inc. plus an online driver application and a staff
portal for reviewing applicants. This is the **demo build**: nothing leaves the browser.

## Run it

Double-click `start-demo.bat`, or:

```
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
```

Demo-only helpers (all switched by `DEMO_MODE` in `src/data/company.ts`):
- Red "DEMO PREVIEW" banner on the site
- "Fill with sample data" on the application
- "Staff portal (demo)" link in the footer, with sample applicants
- Demo logins on the staff sign-in screen (Marc = admin, Kara = staff; both use `propel-demo-1`)
- "Email preview" boxes that show the invite and reset emails on screen instead of sending them

## Where things live

| Path | What |
|---|---|
| `src/data/company.ts` | Company facts, nav, `DEMO_MODE`, `HERO_VIDEO_SRC` (single source of truth) |
| `src/components/Hero.tsx` | Hero: photo with slow push-in, or a video when `HERO_VIDEO_SRC` is set |
| `src/data/content.ts` | Wording used on more than one page (the values) |
| `src/pages/` | Home, About, What We Haul, Drive With Us, Safety, Contact, Privacy |
| `src/features/apply/` | The 18-step driver application |
| `src/features/apply/schema/` | One validation schema per step (shared with the server later) |
| `src/features/apply/legal.ts` | Legal wording transcribed from the DQ packet |
| `src/features/apply/steps.tsx` | Step order. Add or reorder steps here only |
| `src/features/admin/` | Staff portal: sign-in, forgot/set password, applicants, detail, team |
| `src/services/` | Storage seam: localStorage today, Firebase later (swap one file each) |
| `src/services/auth.ts` | Staff accounts: email + password, admin/staff roles, invite and reset links |

## Hero video

See `docs/hero-video-guide.md` for how to turn the tanker photo into a driving clip, and how to
drop it in (`HERO_VIDEO_SRC` in `src/data/company.ts`).

## Going live (not built yet)

1. Replace `src/services/*` with Firebase versions. Staff sign-in becomes Firebase Authentication
   (email + password). Inviting someone = a server function that creates the account and emails
   a set-password link; roles are stored as a custom claim the server checks on every admin action.
2. Cloud Function on submit: validate with the shared schema, store, email the team and
   the applicant, generate a PDF.
3. Set `DEMO_MODE = false`.
4. Real privacy policy review, real logo (vector), real reefer photos.
