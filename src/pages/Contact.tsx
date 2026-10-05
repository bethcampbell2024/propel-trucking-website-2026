import { ButtonLink, PageHeader, Section } from "@/components/ui";
import { ADDRESS_LINE, COMPANY, MAP_EMBED_URL } from "@/data/company";

export function Contact() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Let's talk" intro="Call us, or stop by the office in Russellville." />
      <Section>
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <div className="card self-start">
            <h3 className="display mb-5 text-2xl">{COMPANY.legalName}</h3>
            <address className="space-y-4 not-italic">
              <p>
                <span className="block text-xs font-bold tracking-widest uppercase opacity-50">Address</span>
                {COMPANY.address.street}
                <br />
                {COMPANY.address.city}, {COMPANY.address.state} {COMPANY.address.zip}
              </p>
              <p>
                <span className="block text-xs font-bold tracking-widest uppercase opacity-50">Phone</span>
                <a className="font-semibold text-brand hover:underline" href={COMPANY.phoneHref}>
                  {COMPANY.phone}
                </a>
              </p>
              <p>
                <span className="block text-xs font-bold tracking-widest uppercase opacity-50">Fax</span>
                {COMPANY.fax}
              </p>
            </address>
            <ButtonLink to="/apply" className="mt-6 w-full">
              Apply to drive
            </ButtonLink>
          </div>
          <iframe title={`Map to ${ADDRESS_LINE}`} src={MAP_EMBED_URL} loading="lazy" className="h-96 w-full rounded-2xl border-0 shadow-sm md:h-full md:min-h-96" />
        </div>
      </Section>
    </>
  );
}
