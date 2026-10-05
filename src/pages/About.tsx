import { ButtonLink, CtaBand, FeatureRow, PageHeader, Section, SectionHeading } from "@/components/ui";
import { COMPANY, FOUNDER, PHOTOS } from "@/data/company";
import { VALUES } from "@/data/content";

export function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Propel"
        title="Started in Russellville. Run like family."
        intro={`${COMPANY.legalName} was started by ${FOUNDER.name} in ${COMPANY.address.city}, Arkansas.`}
      />
      <Section>
        <FeatureRow
          eyebrow={`Founded by ${FOUNDER.name}`}
          title="Still a family business"
          body="Propel Trucking is still run like the family business it is. We want drivers who feel at home here: people who know who they work for, and who get treated the way we'd want to be treated. Right now our trucks haul tanker and refrigerated freight."
          media={<img src={PHOTOS.truck105} alt="Propel truck 105 parked beside a shop in Russellville" className="w-full" />}
        />
      </Section>
      <Section tone="white">
        <SectionHeading eyebrow="What we stand for" title="How we do things" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <div key={value.title} className="card bg-paper">
              <h3 className="display text-2xl">{value.title}</h3>
              <p className="mt-3 opacity-75">{value.text}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section tone="dark">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <SectionHeading eyebrow="Find us" title="Come say hello" intro={`${COMPANY.address.street}, ${COMPANY.address.city}, ${COMPANY.address.state} ${COMPANY.address.zip}`} />
          <ButtonLink to="/contact">Contact info</ButtonLink>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
