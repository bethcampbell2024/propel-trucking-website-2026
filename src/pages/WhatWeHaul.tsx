import { ReeferArt } from "@/components/ReeferArt";
import { ButtonLink, CtaBand, FeatureRow, PageHeader, Section } from "@/components/ui";
import { COMPANY, PHOTOS } from "@/data/company";

export function WhatWeHaul() {
  return (
    <>
      <PageHeader
        eyebrow="What we haul"
        title="Tanker and reefer freight"
        intro="Right now, this is what our trucks carry. Whatever is on the trailer, you get the same family-run care: the right equipment, the right drivers, and no surprises."
      />
      <Section>
        <div className="space-y-24">
          <FeatureRow
            eyebrow="Tanker"
            title="Liquid bulk, handled with care"
            body="Our polished tank trailers are built for freight that demands clean, careful handling from the first gallon to the last."
            bullets={["Clean, well-maintained tank trailers", "Drivers trained in safe loading and unloading", "Professional, on-time service"]}
            media={<img src={PHOTOS.tanker} alt="Propel tractor with a polished tank trailer" className="w-full" />}
          />
          <FeatureRow
            flip
            eyebrow="Reefer"
            title="Temperature-controlled, start to finish"
            body="Fresh and frozen freight can't wait, and it can't warm up. Our reefer fleet keeps it cold and keeps it moving."
            bullets={["Refrigerated trailers kept road-ready", "Careful handling from pickup to delivery", "Communication you can count on"]}
            media={<ReeferArt />}
          />
        </div>
      </Section>
      <Section tone="white">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">Something else?</p>
            <h2 className="display text-3xl sm:text-4xl">Got freight that doesn't fit the list?</h2>
            <p className="mt-3 text-lg opacity-75">Give us a call. We're a family company, and we're happy to talk it through.</p>
          </div>
          <ButtonLink href={COMPANY.phoneHref} variant="dark">
            Call {COMPANY.phone}
          </ButtonLink>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
