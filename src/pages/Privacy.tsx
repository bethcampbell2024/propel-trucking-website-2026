import { PageHeader, Section } from "@/components/ui";
import { COMPANY } from "@/data/company";

const SECTIONS: Array<{ title: string; body: string[] }> = [
  {
    title: "What we collect",
    body: [
      "When you apply to drive for us, we collect the information on our employment application: your name, contact details, date of birth, Social Security number, driver's license information, address and employment history, driving and accident record, references, and your electronic signature and consents.",
      "We do not use advertising trackers or sell your information.",
    ],
  },
  {
    title: "Why we collect it",
    body: [
      "We use it to evaluate your application and to meet federal requirements for commercial drivers, including driver qualification, previous-employer and motor vehicle record checks, and drug and alcohol testing programs under 49 CFR Parts 40, 382 and 391. We may also share what is needed with our insurance provider.",
    ],
  },
  {
    title: "Who can see it",
    body: [
      "Only authorized Propel Trucking staff, and service providers who help us carry out the checks you authorize in your application (for example, background, driving record, and testing providers). We do not share your application for marketing.",
    ],
  },
  {
    title: "How we protect it",
    body: ["Applications are transmitted over an encrypted connection and stored in access-controlled systems. Sensitive fields such as your Social Security number are masked in routine views."],
  },
  {
    title: "How long we keep it",
    body: ["We keep applications and driver qualification records for as long as federal and state rules require. An application remains active for 183 days, after which you should reapply to stay under consideration."],
  },
  {
    title: "Your choices",
    body: [`To ask a question about your information, or to request a correction, call us at ${COMPANY.phone} or write to ${COMPANY.legalName}, ${COMPANY.address.street}, ${COMPANY.address.city}, ${COMPANY.address.state} ${COMPANY.address.zip}.`],
  },
];

export function Privacy() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy policy" />
      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="mb-8 rounded-lg border border-brand/30 bg-brand/5 p-4 text-sm">
            <strong>Draft for review.</strong> This is starter text, not legal advice. Have it reviewed before launch.
          </p>
          <div className="space-y-8">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="display text-2xl">{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="mt-3 leading-relaxed opacity-80">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
