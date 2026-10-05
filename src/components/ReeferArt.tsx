import { DEMO_MODE } from "@/data/company";

/**
 * Stand-in illustration until real reefer photos exist.
 * Flat vector so it is obviously art, not a pretend photo of someone else's truck.
 */
export function ReeferArt() {
  return (
    <figure className="relative">
      <svg viewBox="0 0 640 400" className="block h-full w-full" role="img" aria-label="Illustration of a refrigerated trailer">
        <defs>
          <linearGradient id="reefer-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1f2a55" />
            <stop offset="0.7" stopColor="#d9728a" />
            <stop offset="1" stopColor="#ffc58a" />
          </linearGradient>
        </defs>
        <rect width="640" height="400" fill="url(#reefer-sky)" />
        <path d="M0 270 L90 190 L170 250 L270 160 L380 250 L470 200 L560 255 L640 215 V300 H0Z" fill="#4a3f6e" opacity="0.7" />
        <rect y="290" width="640" height="110" fill="#2b2d34" />
        <rect y="338" width="640" height="5" fill="#f0c428" opacity="0.8" />
        {/* trailer */}
        <rect x="50" y="130" width="380" height="150" rx="8" fill="#f1f2ef" />
        <rect x="50" y="232" width="380" height="14" fill="#e5281c" />
        <rect x="430" y="150" width="26" height="100" rx="4" fill="#9aa1ab" />
        {/* snowflake */}
        <g stroke="#3b7fc4" strokeWidth="6" strokeLinecap="round" transform="translate(240 190)">
          {[0, 60, 120].map((deg) => (
            <line key={deg} x1="-38" y1="0" x2="38" y2="0" transform={`rotate(${deg})`} />
          ))}
        </g>
        {/* tractor */}
        <rect x="462" y="168" width="96" height="112" rx="10" fill="#cfd0c9" />
        <rect x="548" y="214" width="60" height="66" rx="8" fill="#c4c5be" />
        <rect x="478" y="182" width="52" height="36" rx="5" fill="#26303f" />
        <rect x="50" y="280" width="558" height="16" fill="#1a1b20" />
        {[110, 160, 520, 580].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="300" r="30" fill="#14151a" />
            <circle cx={cx} cy="300" r="13" fill="#9aa1ab" />
          </g>
        ))}
      </svg>
      {DEMO_MODE && (
        <figcaption className="absolute right-3 bottom-3 rounded bg-ink/70 px-2 py-1 text-[11px] text-white">Illustration - swap in a real reefer photo</figcaption>
      )}
    </figure>
  );
}
