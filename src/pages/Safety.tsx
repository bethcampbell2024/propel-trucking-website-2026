import { ButtonLink, CheckList, PageHeader, Section } from "@/components/ui";
import { ADDRESS_LINE, COMPANY, FMCSA_URL } from "@/data/company";

const COMMITMENTS = [
  "A DOT-compliant drug and alcohol testing program",
  "Driver qualification files kept to FMCSA standards",
  "Pre-employment verification of work history and driving records",
  "Equal opportunity employment for all qualified applicants",
] as const;

export function Safety() {
  return (
    <>
      <PageHeader eyebrow="Safety & credentials" title="Real company. Real record." intro="Here is how to verify us, and what we commit to." />
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="card">
            <h3 className="display mb-5 text-2xl">Our credentials</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-bold tracking-widest uppercase opacity-50">Legal name</dt>
                <dd className="text-lg font-semibold">{COMPANY.legalName}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold tracking-widest uppercase opacity-50">USDOT number</dt>
                <dd className="text-lg font-semibold">{COMPANY.usdot}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold tracking-widest uppercase opacity-50">Address</dt>
                <dd className="text-lg font-semibold">{ADDRESS_LINE}</dd>
              </div>
            </dl>
            <ButtonLink href={FMCSA_URL} className="mt-6">
              Look us up on the FMCSA
            </ButtonLink>
          </div>
          <div className="card">
            <h3 className="display mb-5 text-2xl">Our commitments</h3>
            <CheckList items={COMMITMENTS} />
          </div>
        </div>
      </Section>
    </>
  );
}
