import { z } from "zod";
import { agreed, dateField, email, phone, required, requireWhen, ssn, step, yesNo, zip } from "./primitives";

/**
 * One schema per wizard step. The browser validates a step at a time; the server (later)
 * validates the merged `applicationSchema`. Same rules, one definition.
 */

const address = z.object({ street: required(), city: required(), state: required("Choose a state"), zip });

const employer = z
  .object({
    employer: required("Enter the employer's name"),
    startDate: dateField("Enter a start date"),
    endDate: z.string(),
    current: z.boolean(),
    street: required(),
    city: required(),
    state: required("Choose a state"),
    zip,
    position: required(),
    pay: z.string(),
    payPer: z.string(),
    contact: required("Enter a contact person and phone"),
    reasonLeaving: z.string(),
    fmcsa: yesNo,
    safetySensitive: yesNo,
  })
  .superRefine((row, ctx) => {
    requireWhen(ctx, !row.current, row.endDate, ["endDate"], "Enter an end date");
    requireWhen(ctx, !row.current, row.reasonLeaving, ["reasonLeaving"], "Tell us why you left");
  });

export const SCHEMAS = {
  start: step({
    position: required("Tell us which position you're applying for"),
    over18: yesNo,
    proofOfAge: yesNo,
  }),

  personal: step({
    firstName: required(),
    lastName: required(),
    middleInitial: z.string().max(1, "One letter only"),
    dob: dateField("Enter your date of birth"),
    street: required(),
    city: required(),
    state: required("Choose a state"),
    zip,
    phone,
    email,
    ssn,
    cellCarrier: required("Choose a carrier"),
    smoker: yesNo,
  }),

  cdl: step({
    cdlNumber: required("Enter your CDL number"),
    cdlState: required("Choose a state"),
    cdlYears: z.string().refine((v) => /^\d{1,2}$/.test(v.trim()), "Enter whole years, like 5"),
  }),

  addresses: step({ addresses: z.array(address).min(1) }),

  eligibility: step(
    {
      legalRight: yesNo,
      legalRightHowLong: z.string(),
      canProveRight: yesNo,
      felony: yesNo,
      pendingCharges: yesNo,
      probation: yesNo,
      backgroundExplain: z.string(),
    },
    (d, ctx) => {
      const anyYes = [d.felony, d.pendingCharges, d.probation].includes("yes");
      requireWhen(ctx, anyYes, d.backgroundExplain, ["backgroundExplain"], "Please explain briefly");
    },
  ),

  emergency: step({ emergencyContacts: z.array(z.object({ name: required(), phone, relationship: required() })).min(1) }),

  education: step(
    {
      education: z.array(z.object({ school: required("Enter the school name"), address: z.string(), years: z.string(), degree: z.string(), course: z.string() })),
      nameChanged: yesNo,
      nameChangeDetails: z.string(),
      skills: z.string(),
    },
    (d, ctx) => requireWhen(ctx, d.nameChanged === "yes", d.nameChangeDetails, ["nameChangeDetails"], "List the names and dates"),
  ),

  work: step(
    {
      workedHereBefore: yesNo,
      workedHereWhere: z.string(),
      workedHereFrom: z.string(),
      workedHereTo: z.string(),
      workedHerePosition: z.string(),
      workedHereRate: z.string(),
      workedHerePer: z.string(),
      workedHereReason: z.string(),
      appliedBefore: yesNo,
      appliedBeforeWhen: z.string(),
      employedNow: yesNo,
      lastEmployed: z.string(),
      howHeard: required("Tell us how you heard about us"),
      expectedPay: z.string(),
      dismissed: yesNo,
      dismissedExplain: z.string(),
      contactEmployer: yesNo,
      contactEmployerExplain: z.string(),
      veteran: yesNo,
      veteranBranch: z.string(),
      veteranFrom: z.string(),
      veteranTo: z.string(),
      veteranDischarge: z.string(),
      layoff: yesNo,
      layoffExplain: z.string(),
      unableToPerform: yesNo,
      unableExplain: z.string(),
    },
    (d, ctx) => {
      requireWhen(ctx, d.workedHereBefore === "yes", d.workedHereWhere, ["workedHereWhere"]);
      requireWhen(ctx, d.workedHereBefore === "yes", d.workedHereFrom, ["workedHereFrom"]);
      requireWhen(ctx, d.workedHereBefore === "yes", d.workedHereTo, ["workedHereTo"]);
      requireWhen(ctx, d.employedNow === "no", d.lastEmployed, ["lastEmployed"], "When were you last employed?");
      requireWhen(ctx, d.dismissed === "yes", d.dismissedExplain, ["dismissedExplain"], "Please explain");
      requireWhen(ctx, d.contactEmployer === "no", d.contactEmployerExplain, ["contactEmployerExplain"], "Please explain");
      requireWhen(ctx, d.veteran === "yes", d.veteranBranch, ["veteranBranch"], "Which branch?");
      requireWhen(ctx, d.layoff === "yes", d.layoffExplain, ["layoffExplain"], "Please explain");
      requireWhen(ctx, d.unableToPerform === "yes", d.unableExplain, ["unableExplain"], "Please explain");
    },
  ),

  references: step({ references: z.array(z.object({ name: required(), addressPhone: required("Enter an address and phone number"), relationship: required() })).min(1) }),

  employment: step({ employers: z.array(employer).min(1) }),

  record: step(
    {
      hasAccidents: yesNo,
      accidents: z.array(z.object({ date: z.string(), details: z.string(), fatalities: yesNo, injuries: yesNo })),
      hasConvictions: yesNo,
      convictions: z.array(z.object({ location: z.string(), date: z.string(), charge: z.string(), penalty: z.string() })),
    },
    (d, ctx) => {
      if (d.hasAccidents === "yes") {
        d.accidents.forEach((row, i) => {
          requireWhen(ctx, true, row.date, ["accidents", i, "date"], "Enter the date");
          requireWhen(ctx, true, row.details, ["accidents", i, "details"], "Describe what happened");
        });
      }
      if (d.hasConvictions === "yes") {
        d.convictions.forEach((row, i) => {
          requireWhen(ctx, true, row.date, ["convictions", i, "date"], "Enter the date");
          requireWhen(ctx, true, row.charge, ["convictions", i, "charge"], "Enter the charge");
          requireWhen(ctx, true, row.location, ["convictions", i, "location"], "Enter the location");
        });
      }
    },
  ),

  notices: step({ ackNotices: agreed(), ackEsign: agreed() }),
  fcra: step({ ackFcra: agreed() }),
  release: step({ ackRelease: agreed() }),
  mvr: step({ ackMvr: agreed() }),
  drug: step({ ackDrug: agreed() }),
  license: step({ licenseExpiry: dateField("Enter your license expiration date"), ackLicense: agreed() }),
  sign: step({ printedName: required("Type your full legal name"), signature: z.string().min(1, "Please sign in the box above") }),
};

export type StepId = keyof typeof SCHEMAS;

export const applicationSchema = z.object({
  ...SCHEMAS.start.shape,
  ...SCHEMAS.personal.shape,
  ...SCHEMAS.cdl.shape,
  ...SCHEMAS.addresses.shape,
  ...SCHEMAS.eligibility.shape,
  ...SCHEMAS.emergency.shape,
  ...SCHEMAS.education.shape,
  ...SCHEMAS.work.shape,
  ...SCHEMAS.references.shape,
  ...SCHEMAS.employment.shape,
  ...SCHEMAS.record.shape,
  ...SCHEMAS.notices.shape,
  ...SCHEMAS.fcra.shape,
  ...SCHEMAS.release.shape,
  ...SCHEMAS.mvr.shape,
  ...SCHEMAS.drug.shape,
  ...SCHEMAS.license.shape,
  ...SCHEMAS.sign.shape,
});

export type ApplicationData = z.infer<typeof applicationSchema>;
