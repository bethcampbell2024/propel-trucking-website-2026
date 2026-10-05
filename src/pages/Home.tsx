import { Hero } from "@/components/Hero";
import { ButtonLink, Container, CtaBand, Section, SectionHeading } from "@/components/ui";
import { COMPANY, FMCSA_URL, FOUNDER, PHOTOS } from "@/data/company";
import { VALUES } from "@/data/content";

const FACTS = [
  { title: "Family run", text: `Started by ${FOUNDER.name} in Russellville, AR` },
  { title: "Russellville, Arkansas", text: COMPANY.address.street },
  { title: `USDOT ${COMPANY.usdot}`, text: "Verify our record with the FMCSA", href: FMCSA_URL },
];

function TrustStrip() {
  return (
    <section className="border-b border-ink/10 bg-white">
      <Container className="grid divide-y divide-ink/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {FACTS.map((fact) => (
          <div key={fact.title} className="px-2 py-6 sm:px-8">
            <p className="display text-xl">{fact.title}</p>
            {"href" in fact ? (
              <a className="text-sm font-semibold text-brand hover:underline" href={fact.href} target="_blank" rel="noreferrer">
                {fact.text}
              </a>
            ) : (
              <p className="text-sm opacity-70">{fact.text}</p>
            )}
          </div>
        ))}
      </Container>
    </section>
  );
}

function FamilyStyle() {
  return (
    <Section>
      <SectionHeading eyebrow="How we run" title="Family style, on purpose." intro="Big enough to keep you rolling. Small enough to know your name." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value) => (
          <div key={value.title} className="card">
            <h3 className="display text-2xl">{value.title}</h3>
            <p className="mt-3 opacity-75">{value.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FleetGallery() {
  const shots = [
    { src: PHOTOS.tanker, alt: "Truck 104 with a polished tank trailer", className: "md:col-span-2 md:row-span-2" },
    { src: PHOTOS.truck105, alt: "Truck 105 parked beside a shop", className: "" },
    { src: PHOTOS.truck104, alt: "Truck 104 in the lot", className: "" },
  ];
  return (
    <Section tone="dark">
      <SectionHeading eyebrow="The trucks" title="Real trucks. Real people." intro="Well-kept equipment that carries the Propel name down the road." />
      <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
        {shots.map((shot) => (
          <div key={shot.src} className={`overflow-hidden rounded-2xl ${shot.className}`}>
            <img src={shot.src} alt={shot.alt} loading="lazy" className="h-full min-h-56 w-full object-cover" />
          </div>
        ))}
      </div>
    </Section>
  );
}

function VerifyUs() {
  return (
    <Section tone="white">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="card bg-paper">
          <p className="eyebrow mb-3">Check us out</p>
          <h3 className="display text-3xl">Don't take our word for it.</h3>
          <p className="mt-3 opacity-75">Every legitimate carrier is registered with the FMCSA. Look up Propel&apos;s public safety record yourself.</p>
          <ButtonLink href={FMCSA_URL} variant="dark" className="mt-6">
            View our FMCSA record
          </ButtonLink>
        </div>
        <div className="card bg-ink text-white">
          <p className="eyebrow mb-3">Drivers</p>
          <h3 className="display text-3xl">Looking for a seat?</h3>
          <p className="mt-3 text-white/75">Apply online from your phone. No printing, no scanning, no hunting for a fax machine.</p>
          <ButtonLink to="/apply" className="mt-6">
            Start your application
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <FamilyStyle />
      <FleetGallery />
      <VerifyUs />
      <CtaBand />
    </>
  );
}
