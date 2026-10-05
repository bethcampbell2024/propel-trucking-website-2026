import type { ReactElement } from "react";
import { SCHEMAS, type StepId } from "./schema/application";
import { AddressesStep, CdlStep, EmergencyStep, PersonalStep, StartStep } from "./steps/basics";
import { EducationStep, EligibilityStep, ReferencesStep, WorkBackgroundStep } from "./steps/background";
import { DrugStep, FcraStep, LicenseStep, MvrStep, NoticesStep, ReleaseStep } from "./steps/consents";
import { EmploymentStep, RecordStep } from "./steps/history";
import { SignStep } from "./steps/sign";

export interface StepDef {
  id: StepId;
  section: string;
  title: string;
  lead?: string;
  schema: (typeof SCHEMAS)[StepId]["schema"];
  render: () => ReactElement;
}

const define = (id: StepId, section: string, title: string, render: () => ReactElement, lead?: string): StepDef => ({
  id,
  section,
  title,
  lead,
  schema: SCHEMAS[id].schema,
  render,
});

/** The whole application, in order. Add or reorder steps here and nowhere else. */
export const STEPS: StepDef[] = [
  define("start", "About you", "Let's get started", () => <StartStep />, "A couple of quick questions first."),
  define("personal", "About you", "About you", () => <PersonalStep />, "The basics. This takes about a minute."),
  define("cdl", "About you", "Your CDL", () => <CdlStep />),
  define("addresses", "About you", "Where you've lived", () => <AddressesStep />),
  define("eligibility", "Background", "Work eligibility", () => <EligibilityStep />),
  define("emergency", "Background", "Emergency contacts", () => <EmergencyStep />, "Who should we call if something happens?"),
  define("education", "Background", "Education and skills", () => <EducationStep />),
  define("work", "Background", "Your work background", () => <WorkBackgroundStep />),
  define("references", "Background", "Personal references", () => <ReferencesStep />),
  define("employment", "History", "Employment history", () => <EmploymentStep />),
  define("record", "History", "Driving record", () => <RecordStep />),
  define("notices", "Consents", "Notices and statement", () => <NoticesStep />, "Please read these carefully."),
  define("fcra", "Consents", "Credit reporting disclosure", () => <FcraStep />),
  define("release", "Consents", "Previous employer release", () => <ReleaseStep />),
  define("mvr", "Consents", "Driving record permission", () => <MvrStep />),
  define("drug", "Consents", "Drug testing consent", () => <DrugStep />),
  define("license", "Consents", "License requirements", () => <LicenseStep />),
  define("sign", "Review and sign", "Review and sign", () => <SignStep />, "Almost done."),
];

export const SECTIONS = [...new Set(STEPS.map((s) => s.section))];

/** Index of the first step whose rules fail for these values, or -1 when everything passes. */
export function firstInvalidStep(values: unknown): number {
  return STEPS.findIndex((s) => !s.schema.safeParse(values).success);
}
