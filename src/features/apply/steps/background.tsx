import { useWatch } from "react-hook-form";
import { MILITARY_BRANCHES, PAY_PERIODS } from "@/data/options";
import { Repeater, SelectField, ShowIf, TextAreaField, TextField, YesNoField } from "../fields";
import { blankRow } from "../schema/defaults";
import { StepNote } from "./StepNote";

export function EligibilityStep() {
  const [felony, pending, probation] = useWatch({ name: ["felony", "pendingCharges", "probation"] }) as string[];
  const anyYes = [felony, pending, probation].includes("yes");
  return (
    <div className="space-y-7">
      <YesNoField name="legalRight" label="Do you have the legal right to work in the United States?" />
      <ShowIf name="legalRight">
        <TextField name="legalRightHowLong" label="How long?" optional />
      </ShowIf>
      <YesNoField
        name="canProveRight"
        label="Can you, upon employment, submit documentation verifying your legal right to work in the US and your identity?"
        hint="Only US citizens or aliens who have the legal right to work in the US are eligible for employment."
      />
      <hr className="border-ink/10" />
      <YesNoField name="felony" label="Have you ever been convicted of a felony?" />
      <YesNoField name="pendingCharges" label="Do you currently have any criminal actions pending in which you are the defendant?" />
      <YesNoField name="probation" label="Are you currently on probation or parole?" />
      {anyYes && (
        <div className="animate-step-in space-y-3">
          <StepNote>A conviction, pending action, probation or parole will not necessarily disqualify you from employment.</StepNote>
          <TextAreaField name="backgroundExplain" label="Please explain" />
        </div>
      )}
    </div>
  );
}

export function EducationStep() {
  return (
    <div className="space-y-7">
      <div>
        <p className="mb-3 text-sm font-semibold">Education</p>
        <Repeater name="education" itemLabel="School" addLabel="Add a school" blank={blankRow.school} max={4}>
          {(prefix) => (
            <>
              <TextField name={`${prefix}.school`} label="Name of school" className="sm:col-span-2" />
              <TextField name={`${prefix}.address`} label="Address and phone number" optional className="sm:col-span-2" />
              <TextField name={`${prefix}.years`} label="Years attended" optional />
              <TextField name={`${prefix}.degree`} label="Degree" optional />
              <TextField name={`${prefix}.course`} label="Course of study" optional className="sm:col-span-2" />
            </>
          )}
        </Repeater>
      </div>
      <YesNoField name="nameChanged" label="Should we be aware of any changes of name or assumed name you previously used, to check your work and educational records?" />
      <ShowIf name="nameChanged">
        <TextAreaField name="nameChangeDetails" label="Names used and relevant dates" rows={3} />
      </ShowIf>
      <TextAreaField name="skills" label="Job-related skills, qualifications or other information that supports your application" optional />
    </div>
  );
}

export function WorkBackgroundStep() {
  return (
    <div className="space-y-7">
      <YesNoField name="workedHereBefore" label="Have you worked for Propel Trucking, Inc. before?" />
      <ShowIf name="workedHereBefore">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="workedHereWhere" label="Where?" />
          <TextField name="workedHerePosition" label="Position held" optional />
          <TextField name="workedHereFrom" label="From" type="date" />
          <TextField name="workedHereTo" label="To" type="date" />
          <TextField name="workedHereRate" label="Rate of pay ($)" optional inputMode="decimal" />
          <SelectField name="workedHerePer" label="Per" options={PAY_PERIODS} optional />
          <TextField name="workedHereReason" label="Reason for leaving" optional className="sm:col-span-2" />
        </div>
      </ShowIf>

      <YesNoField name="appliedBefore" label="Have you ever applied here before?" />
      <ShowIf name="appliedBefore">
        <TextField name="appliedBeforeWhen" label="When?" optional />
      </ShowIf>

      <YesNoField name="employedNow" label="Are you employed now?" />
      <ShowIf name="employedNow" equals="no">
        <TextField name="lastEmployed" label="When were you last employed?" />
      </ShowIf>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="howHeard" label="How did you hear about Propel Trucking, Inc.?" />
        <TextField name="expectedPay" label="Rate of pay expected ($)" optional inputMode="decimal" />
      </div>

      <YesNoField name="dismissed" label="Have you ever been dismissed or forced to resign from any employment?" />
      <ShowIf name="dismissed">
        <TextAreaField name="dismissedExplain" label="Please explain" rows={3} />
      </ShowIf>

      <YesNoField name="contactEmployer" label="May we contact your present employer?" />
      <ShowIf name="contactEmployer" equals="no">
        <TextAreaField name="contactEmployerExplain" label="Please explain" rows={3} />
      </ShowIf>

      <YesNoField name="veteran" label="Are you a military veteran?" />
      <ShowIf name="veteran">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField name="veteranBranch" label="Branch" options={MILITARY_BRANCHES} className="sm:col-span-2" />
          <TextField name="veteranFrom" label="Service from" type="date" optional />
          <TextField name="veteranTo" label="Service to" type="date" optional />
          <TextField name="veteranDischarge" label="Date of discharge" type="date" optional />
        </div>
      </ShowIf>

      <YesNoField name="layoff" label="Are you on a layoff or subject to a recall?" />
      <ShowIf name="layoff">
        <TextAreaField name="layoffExplain" label="Please explain" rows={3} />
      </ShowIf>

      <YesNoField name="unableToPerform" label="Is there any reason you might be unable to perform the functions of the job for which you have applied?" />
      <ShowIf name="unableToPerform">
        <TextAreaField name="unableExplain" label="Please explain" rows={3} />
      </ShowIf>
    </div>
  );
}

export function ReferencesStep() {
  return (
    <Repeater name="references" itemLabel="Reference" addLabel="Add another reference" blank={blankRow.reference} min={1} max={4}>
      {(prefix) => (
        <>
          <TextField name={`${prefix}.name`} label="Name" />
          <TextField name={`${prefix}.relationship`} label="Relationship" />
          <TextField name={`${prefix}.addressPhone`} label="Address and phone number" className="sm:col-span-2" />
        </>
      )}
    </Repeater>
  );
}
