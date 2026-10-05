import { Hero } from "@/components/Hero";
import { Container, CtaBand, Section, SectionHeading } from "@/components/ui";
import { COMPANY, FOUNDER, PHOTOS } from "@/data/company";
import { VALUES } from "@/data/content";

const FACTS = [
  { title: "Family run", text: `Started by ${FOUNDER.name} in Russellville, AR` },
  { title: "Russellville, Arkansas", text: COMPANY.address.street },
  { title: `USDOT ${COMPANY.usdot}`, text: "Registered motor carrier" },
];

function TrustStrip() {
  return (
    <section className="border-b border-ink/10 bg-white">
      <Container className="grid divide-y divide-ink/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {FACTS.map((fact) => (
          <div key={fact.title} className="px-2 py-6 sm:px-8">
            <p className="display text-xl">{fact.title}</p>
            <p className="text-sm opacity-70">{fact.text}</p>
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

export function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <FamilyStyle />
      <FleetGallery />
      <CtaBand />
    </>
  );
}
