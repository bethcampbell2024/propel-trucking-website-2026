import type { ReactNode } from "react";
import type { LegalSection } from "../legal";

/** Scrollable, readable legal copy. Same component for every consent screen. */
export function LegalText({ sections, children }: { sections: LegalSection[]; children?: ReactNode }) {
  return (
    <div>
      <div tabIndex={0} className="max-h-80 space-y-4 overflow-y-auto rounded-xl border border-ink/15 bg-white p-5 text-sm leading-relaxed text-ink/80 focus:ring-4 focus:ring-brand/15 focus:outline-none">
        {sections.map((section, i) => (
          <div key={section.heading ?? i} className="space-y-3">
            {section.heading && <h3 className="display text-base text-ink">{section.heading}</h3>}
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        ))}
        {children}
      </div>
      <p className="mt-2 text-xs opacity-55">Scroll to read the full text.</p>
    </div>
  );
}
