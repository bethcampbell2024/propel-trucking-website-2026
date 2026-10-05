import type { ReactNode } from "react";
import { useWatch } from "react-hook-form";
import { COMPANY } from "@/data/company";
import { formatDate } from "@/lib/format";
import { CheckField, TextField } from "../fields";
import {
  DRUG_TEST_CONSENT,
  ESIGN_AGREEMENT,
  FCRA_DISCLOSURE,
  LICENSE_REQUIREMENTS,
  MVR_PERMISSION,
  NOTICE_TO_APPLICANT,
  releaseOfInformation,
  type LegalSection,
} from "../legal";
import type { ApplicationData } from "../schema/application";
import { LegalText } from "./LegalText";
import { StepNote } from "./StepNote";

/** Read the text, tick the box. Every consent screen is this one shape. */
function Consent({ sections, ackName, ackLabel, children }: { sections: LegalSection[]; ackName: string; ackLabel: ReactNode; children?: ReactNode }) {
  return (
    <div className="space-y-4">
      {children}
      <LegalText sections={sections} />
      <CheckField name={ackName}>{ackLabel}</CheckField>
    </div>
  );
}

function Facts({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="grid gap-3 rounded-xl bg-white p-4 text-sm ring-1 ring-ink/10 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs font-semibold tracking-wide uppercase opacity-50">{label}</dt>
          <dd className="font-medium">{value || "-"}</dd>
        </div>
      ))}
    </dl>
  );
}

function joinNames(names: string[]): string {
  if (names.length === 0) return "each of my previous employers listed in this application";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export function NoticesStep() {
  return (
    <div className="space-y-8">
      <Consent
        sections={NOTICE_TO_APPLICANT}
        ackName="ackNotices"
        ackLabel="I have read and understand the notices above, and I certify that the answers in this application are true and complete to the best of my knowledge."
      />
      <Consent sections={ESIGN_AGREEMENT} ackName="ackEsign" ackLabel="I agree that my electronic signature has the same force and effect as an original signature." />
    </div>
  );
}

export function FcraStep() {
  return (
    <Consent
      sections={FCRA_DISCLOSURE}
      ackName="ackFcra"
      ackLabel="I have received and read this disclosure. I understand that reports on my employment history, drug and alcohol test results and driving record may be obtained for employment purposes."
    />
  );
}

export function ReleaseStep() {
  const employers = (useWatch({ name: "employers" }) ?? []) as ApplicationData["employers"];
  const names = employers.map((e) => e.employer.trim()).filter(Boolean);
  return (
    <Consent
      sections={releaseOfInformation(joinNames(names))}
      ackName="ackRelease"
      ackLabel={`I authorize the release of the information described above, and I understand my due process rights under the FMCSR.`}
    >
      <StepNote>The employer names below are filled in from your employment history, so you only enter them once.</StepNote>
    </Consent>
  );
}

export function MvrStep() {
  const v = useWatch() as ApplicationData;
  return (
    <Consent sections={MVR_PERMISSION} ackName="ackMvr" ackLabel={`I give ${COMPANY.legalName} and its insurance agent permission to obtain and review my driver license (MVR) record, now and in the future.`}>
      <Facts
        items={[
          ["Name", `${v.firstName} ${v.middleInitial} ${v.lastName}`.replace(/\s+/g, " ").trim()],
          ["Date of birth", formatDate(v.dob)],
          ["Address", [v.street, v.city, v.state, v.zip].filter(Boolean).join(", ")],
          ["Driver's license", [v.cdlNumber, v.cdlState].filter(Boolean).join(" / ")],
        ]}
      />
    </Consent>
  );
}

export function DrugStep() {
  return (
    <Consent
      sections={DRUG_TEST_CONSENT}
      ackName="ackDrug"
      ackLabel="I have read and understand this consent and release, and I sign it voluntarily."
    >
      <StepNote>A Propel representative will complete the witness portion with you in person.</StepNote>
    </Consent>
  );
}

export function LicenseStep() {
  const v = useWatch() as ApplicationData;
  return (
    <Consent sections={LICENSE_REQUIREMENTS} ackName="ackLicense" ackLabel="I certify that I have read and understand the above requirements, and that the license below is the only driver's license I have and will possess.">
      <Facts
        items={[
          ["License number", v.cdlNumber],
          ["State of issuance", v.cdlState],
        ]}
      />
      <TextField name="licenseExpiry" label="License expiration date" type="date" />
    </Consent>
  );
}
