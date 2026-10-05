/** Single source of truth for everything about the company that shows up in more than one place. */

/** While true, the site shows a demo banner and the form offers sample data. Flip off for launch. */
export const DEMO_MODE = true;

/** Public-folder file -> URL that also works when the site is served from a sub-path (GitHub Pages). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

/** Drop a real clip at e.g. "video/hero.mp4" and it plays over the poster photo below. */
export const HERO_VIDEO_SRC: string | null = asset("video/hero.mp4");
/** Shown while the video loads, and instead of it for reduced-motion or data-saver visitors. */
export const HERO_POSTER = asset("images/hero-poster.webp");

export const FOUNDER = { name: "Marc Campbell", title: "Founder" } as const;

export const COMPANY = {
  legalName: "Propel Trucking, Inc.",
  name: "Propel Trucking",
  usdot: "1585279",
  phone: "(479) 967-3460",
  phoneHref: "tel:+14799673460",
  fax: "(479) 967-3459",
  address: { street: "3305 E Main Street", city: "Russellville", state: "AR", zip: "72802" },
} as const;

const { street, city, state, zip } = COMPANY.address;
export const ADDRESS_LINE = `${street}, ${city}, ${state} ${zip}`;

export const FMCSA_URL = `https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type=queryCarrierSnapshot&query_param=USDOT&query_string=${COMPANY.usdot}`;
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_LINE)}&output=embed`;

export const NAV_LINKS = [
  { to: "/about", label: "About" },
  { to: "/what-we-haul", label: "What We Haul" },
  { to: "/drive", label: "Drive With Us" },
  { to: "/safety", label: "Safety" },
  { to: "/contact", label: "Contact" },
] as const;

export const PHOTOS = {
  tanker: asset("images/fleet-tanker.webp"),
  truck105: asset("images/fleet-105.webp"),
  truck104: asset("images/fleet-104.webp"),
} as const;
