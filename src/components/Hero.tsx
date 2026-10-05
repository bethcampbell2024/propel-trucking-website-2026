import { useState } from "react";
import { ButtonLink, Container } from "@/components/ui";
import { HERO_POSTER, HERO_VIDEO_SRC } from "@/data/company";
import { cx } from "@/lib/cx";

/** Video only for people who want motion and bandwidth; everyone else gets the photo. */
function shouldPlayVideo(): boolean {
  if (!HERO_VIDEO_SRC) return false;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return !reducedMotion && !saveData;
}

function HeroBackdrop() {
  const [playVideo] = useState(shouldPlayVideo);
  const [videoReady, setVideoReady] = useState(false);
  return (
    <>
      <img
        src={HERO_POSTER}
        alt="A Propel Trucking tractor and tank trailer"
        className={cx("absolute inset-0 h-full w-full object-cover object-[32%_50%]", !playVideo && "animate-slow-zoom")}
      />
      {playVideo && HERO_VIDEO_SRC && (
        <video
          className={cx("absolute inset-0 h-full w-full object-cover object-[32%_50%] transition-opacity duration-1000", videoReady ? "opacity-100" : "opacity-0")}
          src={HERO_VIDEO_SRC}
          poster={HERO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
        />
      )}
    </>
  );
}

export function Hero() {
  return (
    <section className="relative isolate flex h-[calc(100svh-6.5rem)] max-h-[880px] min-h-[600px] items-end overflow-hidden bg-ink text-white">
      <HeroBackdrop />
      <div className="absolute inset-0 bg-black/25" />
      {/* Scrim for the headline only: bottom-up on phones (text is full width), bottom-left corner on larger screens, so the mountains up top keep their colour. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent sm:bg-gradient-to-tr sm:from-ink/75 sm:via-ink/15" />
      {/* Text sits lower-left, so the door, logo and trailer stay clear. */}
      <Container className="relative pb-10 sm:pb-14">
        <div className="animate-fade-up text-shadow-hero sm:max-w-lg">
          <p className="eyebrow mb-4 !text-white/80">Russellville, Arkansas · USDOT 1585279</p>
          <h1 className="display text-5xl sm:text-6xl">
            Drive with a
            <br />
            <span className="text-brand">family</span> company.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
            Propel Trucking was started by Marc Campbell in Russellville, Arkansas, and we still run it that way. You're a person here, not a unit number.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 text-shadow-none">
            <ButtonLink to="/apply">Apply to drive</ButtonLink>
            <ButtonLink to="/about" variant="ghost">
              Our story
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
