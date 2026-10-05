import { CARRIERS, US_STATES } from "@/data/options";
import { AddressFields, PhoneField, Repeater, SelectField, SsnField, TextField, YesNoField } from "../fields";
import { blankRow } from "../schema/defaults";
import { StepNote } from "./StepNote";

export function StartStep() {
  return (
    <div className="space-y-7">
      <TextField name="position" label="Position you're applying for" placeholder="Company driver" />
      <YesNoField name="over18" label="Are you over 18 years of age?" />
      <YesNoField name="proofOfAge" label="Can you provide proof of age?" />
    </div>
  );
}

export function PersonalStep() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField name="firstName" label="First name" autoComplete="given-name" />
      <TextField name="lastName" label="Last name" autoComplete="family-name" />
      <TextField name="middleInitial" label="Middle initial" optional maxLength={1} />
      <TextField name="dob" label="Date of birth" type="date" autoComplete="bday" />
      <AddressFields />
      <PhoneField name="phone" label="Phone" />
      <TextField name="email" label="Email" type="email" inputMode="email" autoComplete="email" />
      <SsnField
        name="ssn"
        label="Social Security number"
        hint="Required for DOT, insurance and background checks. Sent over an encrypted connection; only authorized staff can view it."
        className="sm:col-span-2"
      />
      <SelectField name="cellCarrier" label="Cell phone carrier" options={CARRIERS} />
      <YesNoField name="smoker" label="Do you smoke?" />
    </div>
  );
}

export function CdlStep() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField name="cdlNumber" label="CDL driver's license number" autoComplete="off" />
      <SelectField name="cdlState" label="State of issuance" options={US_STATES} placeholder="State" />
      <TextField name="cdlYears" label="Years of CDL driving experience" inputMode="numeric" maxLength={2} className="sm:col-span-2" />
    </div>
  );
}

export function AddressesStep() {
  return (
    <div className="space-y-5">
      <StepNote>List every address for the past 3 years, most recent first.</StepNote>
      <Repeater name="addresses" itemLabel="Address" addLabel="Add another address" blank={blankRow.address} min={1}>
        {(prefix) => <AddressFields prefix={prefix} />}
      </Repeater>
    </div>
  );
}

export function EmergencyStep() {
  return (
    <Repeater name="emergencyContacts" itemLabel="Contact" addLabel="Add another contact" blank={blankRow.contact} min={1} max={3}>
      {(prefix) => (
        <>
          <TextField name={`${prefix}.name`} label="Name" className="sm:col-span-2" />
          <PhoneField name={`${prefix}.phone`} label="Phone" />
          <TextField name={`${prefix}.relationship`} label="Relationship" placeholder="Spouse, parent, friend..." />
        </>
      )}
    </Repeater>
  );
}
