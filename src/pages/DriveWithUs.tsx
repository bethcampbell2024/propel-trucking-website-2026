import { ButtonLink, CheckList, CtaBand, FeatureRow, PageHeader, Section, SectionHeading } from "@/components/ui";
import { FOUNDER, PHOTOS } from "@/data/company";

const REQUIREMENTS = [
  "A valid CDL",
  "Verifiable work history for the past 3 years",
  "A safe driving record",
  "Able to pass a DOT physical and drug and alcohol screening",
  "Legal right to work in the United States",
] as const;

const HAVE_READY = [
  "Your CDL number and the state that issued it",
  "Addresses for the past 3 years",
  "Employer names, dates and contact info for the past 3 years",
  "Any accidents or traffic convictions from the past 3 years",
  "Two people we can call in an emergency, plus personal references",
] as const;

const STEPS = [
  { title: "Apply online", text: "Fill it out on your phone or computer. It saves as you go, so you can come back." },
  { title: "We review", text: "We check your history and verify your qualifications." },
  { title: "We reach out", text: "If it looks like a fit, we'll contact you to talk next steps." },
];

export function DriveWithUs() {
  return (
    <>
      <PageHeader
        eyebrow="Drive with us"
        title="Come drive with family"
        intro="Propel is a family-run company in Russellville, Arkansas. If you'd rather be known by name than by unit number, we'd like to hear from you."
      />
      <Section tone="white">
        <FeatureRow
          eyebrow="What it's like"
          title="You'll know who you work for"
          body={`${FOUNDER.name} started Propel, and it's still run that way: real people, straight talk, and a company that keeps its word. Professional drivers who take pride in the job fit right in.`}
          media={<img src={PHOTOS.truck104} alt="A Propel tractor ready to roll" className="w-full" />}
        />
      </Section>
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="card">
            <h3 className="display mb-5 text-2xl">What we look for</h3>
            <CheckList items={REQUIREMENTS} />
          </div>
          <div className="card">
            <h3 className="display mb-5 text-2xl">Have these handy</h3>
            <CheckList items={HAVE_READY} />
            <p className="mt-5 text-sm opacity-60">Takes about 15 to 20 minutes. Your progress is saved on your device.</p>
          </div>
        </div>
      </Section>
      <Section tone="white">
        <SectionHeading eyebrow="How it works" title="Three simple steps" />
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="card bg-paper">
              <span className="display text-5xl text-brand">{index + 1}</span>
              <h3 className="display mt-2 text-2xl">{step.title}</h3>
              <p className="mt-2 opacity-75">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <ButtonLink to="/apply">Start your application</ButtonLink>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
