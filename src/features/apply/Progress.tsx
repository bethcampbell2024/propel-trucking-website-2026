import { STEPS, SECTIONS } from "./steps";

/** One bar segment per section, filling as the applicant moves through its steps. */
export function Progress({ index }: { index: number }) {
  const current = STEPS[index].section;
  const currentSection = SECTIONS.indexOf(current);
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold">{current}</span>
        <span className="opacity-60">
          Step {index + 1} of {STEPS.length}
        </span>
      </div>
      <div className="mt-2 flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={index + 1}>
        {SECTIONS.map((section, i) => {
          const stepsInSection = STEPS.filter((s) => s.section === section);
          const finished = stepsInSection.filter((s) => STEPS.indexOf(s) < index).length;
          const percent = i < currentSection ? 100 : i === currentSection ? ((finished + 1) / stepsInSection.length) * 100 : 0;
          return (
            <div key={section} className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
              <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${percent}%` }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
