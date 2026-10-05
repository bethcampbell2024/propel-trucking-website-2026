import { useWatch } from "react-hook-form";
import { PAY_PERIODS } from "@/data/options";
import { findGaps, type EmploymentSpan } from "@/lib/employmentGaps";
import { formatDate } from "@/lib/format";
import { AddressFields, CheckField, Repeater, SelectField, ShowIf, TextAreaField, TextField, YesNoField } from "../fields";
import { blankRow } from "../schema/defaults";
import { StepNote } from "./StepNote";

/** Live check that the last 3 years are covered. Advisory only; staff follow up on real gaps. */
function GapNotice() {
  const employers = (useWatch({ name: "employers" }) ?? []) as EmploymentSpan[];
  if (!employers.some((e) => e.startDate)) return null;
  const gaps = findGaps(employers);
  if (gaps.length === 0) return <StepNote tone="good">Nice: your last 3 years look fully covered.</StepNote>;
  return (
    <StepNote tone="warn">
      <p className="font-semibold">Heads up: we see a possible gap.</p>
      <ul className="mt-1 list-disc pl-5">
        {gaps.map((gap) => (
          <li key={gap.from.toISOString()}>
            {formatDate(gap.from.toISOString())} to {formatDate(gap.to.toISOString())}
          </li>
        ))}
      </ul>
      <p className="mt-2">DOT needs 3 years with no gaps. If you were unemployed, add a row and enter "Unemployed" as the employer.</p>
    </StepNote>
  );
}

function EmployerRow({ prefix }: { prefix: string }) {
  const current = useWatch({ name: `${prefix}.current` }) as boolean;
  return (
    <>
      <TextField name={`${prefix}.employer`} label="Employer name" className="sm:col-span-2" />
      <TextField name={`${prefix}.startDate`} label="Start date" type="date" />
      <TextField name={`${prefix}.endDate`} label="End date" type="date" disabled={current} />
      <CheckField name={`${prefix}.current`} className="sm:col-span-2">
        I currently work here
      </CheckField>
      <AddressFields prefix={prefix} />
      <TextField name={`${prefix}.position`} label="Position held" />
      <div className="grid grid-cols-2 gap-3">
        <TextField name={`${prefix}.pay`} label="Pay ($)" optional inputMode="decimal" />
        <SelectField name={`${prefix}.payPer`} label="Per" options={PAY_PERIODS} optional />
      </div>
      <TextField name={`${prefix}.contact`} label="Contact person and phone" className="sm:col-span-2" />
      {!current && <TextField name={`${prefix}.reasonLeaving`} label="Reason for leaving" className="sm:col-span-2" />}
      <YesNoField name={`${prefix}.fmcsa`} label="Were you subject to FMCSA regulations while employed here?" className="sm:col-span-2" />
      <YesNoField
        name={`${prefix}.safetySensitive`}
        label="Was your job a safety-sensitive function in a DOT-regulated mode, subject to drug and alcohol testing under 49 CFR Part 40?"
        className="sm:col-span-2"
      />
    </>
  );
}

export function EmploymentStep() {
  return (
    <div className="space-y-5">
      <StepNote>
        List employers for the past 3 years, most recent first. If you drove a commercial vehicle, DOT also asks for the 7 years before that; you can add them here too.
      </StepNote>
      <GapNotice />
      <Repeater name="employers" itemLabel="Employer" addLabel="Add another employer" blank={blankRow.employer} min={1} max={10}>
        {(prefix) => <EmployerRow prefix={prefix} />}
      </Repeater>
    </div>
  );
}

export function RecordStep() {
  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <YesNoField name="hasAccidents" label="Any accidents in the past 3 years?" />
        <ShowIf name="hasAccidents">
          <Repeater name="accidents" itemLabel="Accident" addLabel="Add another accident" blank={blankRow.accident} min={1} max={6}>
            {(prefix) => (
              <>
                <TextField name={`${prefix}.date`} label="Date" type="date" />
                <div className="hidden sm:block" />
                <TextAreaField name={`${prefix}.details`} label="Details" rows={3} className="sm:col-span-2" />
                <YesNoField name={`${prefix}.fatalities`} label="Fatalities?" />
                <YesNoField name={`${prefix}.injuries`} label="Injuries?" />
              </>
            )}
          </Repeater>
        </ShowIf>
      </div>
      <hr className="border-ink/10" />
      <div className="space-y-5">
        <YesNoField name="hasConvictions" label="Any traffic convictions or forfeitures in the past 3 years (other than parking)?" />
        <ShowIf name="hasConvictions">
          <Repeater name="convictions" itemLabel="Conviction" addLabel="Add another conviction" blank={blankRow.conviction} min={1} max={6}>
            {(prefix) => (
              <>
                <TextField name={`${prefix}.date`} label="Date" type="date" />
                <TextField name={`${prefix}.location`} label="Location" />
                <TextField name={`${prefix}.charge`} label="Charge" />
                <TextField name={`${prefix}.penalty`} label="Penalty" optional />
              </>
            )}
          </Repeater>
        </ShowIf>
      </div>
    </div>
  );
}
