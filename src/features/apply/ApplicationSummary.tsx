import type { ReactNode } from "react";
import { formatDate, redactSsn } from "@/lib/format";
import type { ApplicationData } from "./schema/application";

/**
 * Read-only view of a whole application. Used on the final review step
 * and (with the SSN revealed on demand) in the staff portal.
 */
const yn = (value: string) => (value === "yes" ? "Yes" : value === "no" ? "No" : "");
const fullName = (d: ApplicationData) => [d.firstName, d.middleInitial, d.lastName].filter(Boolean).join(" ");
const place = (r: { street: string; city: string; state: string; zip: string }) => [r.street, r.city, r.state, r.zip].filter(Boolean).join(", ");

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl bg-white p-5 ring-1 ring-ink/10 break-inside-avoid">
      <h3 className="display mb-3 text-lg">{title}</h3>
      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Row({ label, value, wide }: { label: string; value?: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-semibold tracking-wide uppercase opacity-50">{label}</dt>
      <dd className="font-medium break-words">{value || <span className="opacity-30">-</span>}</dd>
    </div>
  );
}

const Item = ({ children }: { children: ReactNode }) => <div className="rounded-lg bg-paper p-3 text-sm sm:col-span-2">{children}</div>;

export function ApplicationSummary({ data: d, ssn = "masked", signedAt }: { data: ApplicationData; ssn?: "masked" | "full"; signedAt?: string }) {
  return (
    <div className="space-y-4">
      <Block title="Applicant">
        <Row label="Name" value={fullName(d)} />
        <Row label="Position" value={d.position} />
        <Row label="Address" value={place(d)} wide />
        <Row label="Phone" value={d.phone} />
        <Row label="Email" value={d.email} />
        <Row label="Date of birth" value={formatDate(d.dob)} />
        <Row label="Social Security number" value={ssn === "full" ? d.ssn : redactSsn(d.ssn)} />
        <Row label="CDL number" value={[d.cdlNumber, d.cdlState].filter(Boolean).join(" / ")} />
        <Row label="CDL experience" value={d.cdlYears && `${d.cdlYears} years`} />
        <Row label="License expires" value={formatDate(d.licenseExpiry)} />
        <Row label="Over 18 / proof of age" value={`${yn(d.over18)} / ${yn(d.proofOfAge)}`} />
        <Row label="Cell carrier / smoker" value={`${d.cellCarrier} / ${yn(d.smoker)}`} />
      </Block>

      <Block title="Eligibility and background">
        <Row label="Legal right to work" value={`${yn(d.legalRight)}${d.legalRightHowLong ? ` (${d.legalRightHowLong})` : ""}`} />
        <Row label="Can verify identity and eligibility" value={yn(d.canProveRight)} />
        <Row label="Felony conviction" value={yn(d.felony)} />
        <Row label="Pending criminal actions" value={yn(d.pendingCharges)} />
        <Row label="Probation or parole" value={yn(d.probation)} />
        {d.backgroundExplain && <Row label="Explanation" value={d.backgroundExplain} wide />}
      </Block>

      <Block title="Address history (3 years)">
        {d.addresses.map((a, i) => (
          <Item key={i}>{place(a)}</Item>
        ))}
      </Block>

      <Block title="Emergency contacts and references">
        {d.emergencyContacts.map((c, i) => (
          <Item key={i}>
            <strong>{c.name}</strong> ({c.relationship}) {c.phone}
          </Item>
        ))}
        {d.references.map((r, i) => (
          <Item key={i}>
            Reference: <strong>{r.name}</strong> ({r.relationship}) {r.addressPhone}
          </Item>
        ))}
      </Block>

      <Block title="Education and skills">
        {d.education.map((s, i) => (
          <Item key={i}>
            <strong>{s.school}</strong> {[s.years, s.degree, s.course].filter(Boolean).join(" / ")}
          </Item>
        ))}
        <Row label="Other names used" value={d.nameChanged === "yes" ? d.nameChangeDetails : yn(d.nameChanged)} />
        <Row label="Skills" value={d.skills} wide />
      </Block>

      <Block title="Work background">
        <Row label="Worked for Propel before" value={d.workedHereBefore === "yes" ? `Yes: ${d.workedHereWhere}, ${formatDate(d.workedHereFrom)} to ${formatDate(d.workedHereTo)}` : yn(d.workedHereBefore)} />
        <Row label="Applied here before" value={d.appliedBefore === "yes" ? `Yes (${d.appliedBeforeWhen})` : yn(d.appliedBefore)} />
        <Row label="Employed now" value={d.employedNow === "no" ? `No, last employed ${d.lastEmployed}` : yn(d.employedNow)} />
        <Row label="How they heard about us" value={d.howHeard} />
        <Row label="Expected pay" value={d.expectedPay && `$${d.expectedPay}`} />
        <Row label="Dismissed or forced to resign" value={d.dismissed === "yes" ? `Yes: ${d.dismissedExplain}` : yn(d.dismissed)} />
        <Row label="May contact present employer" value={d.contactEmployer === "no" ? `No: ${d.contactEmployerExplain}` : yn(d.contactEmployer)} />
        <Row label="Military veteran" value={d.veteran === "yes" ? `Yes: ${d.veteranBranch}` : yn(d.veteran)} />
        <Row label="Layoff or recall" value={d.layoff === "yes" ? `Yes: ${d.layoffExplain}` : yn(d.layoff)} />
        <Row label="Unable to perform job functions" value={d.unableToPerform === "yes" ? `Yes: ${d.unableExplain}` : yn(d.unableToPerform)} />
      </Block>

      <Block title="Employment history">
        {d.employers.map((e, i) => (
          <Item key={i}>
            <p className="font-semibold">{e.employer}</p>
            <p className="opacity-70">
              {formatDate(e.startDate)} to {e.current ? "present" : formatDate(e.endDate)} / {e.position}
            </p>
            <p className="opacity-70">{place(e)}</p>
            <p className="opacity-70">Contact: {e.contact}</p>
            {e.reasonLeaving && <p className="opacity-70">Left because: {e.reasonLeaving}</p>}
            <p className="opacity-70">
              FMCSA-regulated: {yn(e.fmcsa)} / Safety-sensitive (drug and alcohol testing): {yn(e.safetySensitive)}
            </p>
          </Item>
        ))}
      </Block>

      <Block title="Driving record (3 years)">
        <Row label="Accidents" value={d.accidents.length ? undefined : "None reported"} wide />
        {d.accidents.map((a, i) => (
          <Item key={i}>
            {formatDate(a.date)}: {a.details} (fatalities: {yn(a.fatalities)}, injuries: {yn(a.injuries)})
          </Item>
        ))}
        <Row label="Traffic convictions" value={d.convictions.length ? undefined : "None reported"} wide />
        {d.convictions.map((c, i) => (
          <Item key={i}>
            {formatDate(c.date)}: {c.charge} in {c.location} {c.penalty && `(${c.penalty})`}
          </Item>
        ))}
      </Block>

      <Block title="Consents and signature">
        <Row label="Notices and applicant statement" value={d.ackNotices ? "Agreed" : "Not agreed"} />
        <Row label="Electronic signature agreement" value={d.ackEsign ? "Agreed" : "Not agreed"} />
        <Row label="FCRA disclosure" value={d.ackFcra ? "Acknowledged" : "Not acknowledged"} />
        <Row label="Previous employer release" value={d.ackRelease ? "Authorized" : "Not authorized"} />
        <Row label="MVR permission" value={d.ackMvr ? "Granted" : "Not granted"} />
        <Row label="Drug testing consent" value={d.ackDrug ? "Consented" : "Not consented"} />
        <Row label="License requirements certification" value={d.ackLicense ? "Certified" : "Not certified"} />
        <Row label="Signed" value={signedAt ? formatDate(signedAt) : undefined} />
        <Row label="Printed name" value={d.printedName} />
        <div className="sm:col-span-2">
          <dt className="text-xs font-semibold tracking-wide uppercase opacity-50">Signature</dt>
          <dd>{d.signature ? <img src={d.signature} alt="Applicant signature" className="h-20 rounded border border-ink/10 bg-white" /> : <span className="opacity-30">-</span>}</dd>
        </div>
      </Block>
    </div>
  );
}
