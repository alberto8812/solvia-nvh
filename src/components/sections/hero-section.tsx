import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { hero } from "@/data";
import { Button } from "@/components/ui";
import { EASE } from "@/components/motion";

const beat = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
});

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      // Autoplay blocked (e.g. WhatsApp in-app browser, iOS Low Power Mode, Android Data Saver).
      // Fall back to a plain <img> so no native tap-to-play affordance shows up.
      setAutoplayBlocked(true);
    });
  }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-brand-900 flex items-stretch sm:items-center min-h-[clamp(520px,42vw,720px)]"
    >
      {/* Background video */}
      {autoplayBlocked ? (
        <img
          src="/images/hero-bg-poster.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover lg:object-[50%_25%]"
          style={{ filter: "saturate(0.9)" }}
        />
      ) : (
        <video
          ref={videoRef}
          src={hero.bgVideo}
          poster="/images/hero-bg-poster.jpg"
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover lg:object-[50%_25%]"
          style={{ filter: "saturate(0.9)" }}
          autoPlay
          muted
          playsInline
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900/60   md:from-brand-900/90 md:from-10% from-100% via-brand-900/50 md:via-brand-900/85 via-25% to-transparent to-85% pointer-events-none" />

      {/* Content — intentionally NOT wrapped in the shared Container: the hero
          sits on a full-bleed background image/video, so its text stays
          pinned to the viewport edge (own padding) instead of centering
          inside the sitewide 1280px column like every other section. */}
      <div className="relative w-full flex flex-col px-5 sm:px-8 md:px-12 pt-24 pb-8 md:pt-24 md:pb-[104px] max-w-[640px]">
        {/* Beat 1 — eyebrow (reserves its space now, reveals at 4s) */}
        <motion.div {...beat(0.7)}>
          <div className="pl-1.5 sm:pl-0 font-sans font-bold text-xs font-medium tracking-[.14em] uppercase flex items-center gap-2 text-on-brand">
            <span className="w-[22px] h-px bg-white" />
            {hero.eyebrow}
          </div>
        </motion.div>

        {/* Beat 1 — headline (immediate) */}
        <motion.h1
          {...beat(0)}
          className="pl-1.5 sm:pl-0 font-sans font-bold text-on-brand"
          style={{
            fontSize: "clamp(30px, 8vw, 56px)",
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            textWrap: "balance",
            margin: "22px 0 0",
          }}
        >
          {hero.headline}{" "}
          <span className="font-sans   font-normal text-on-brand">
            {hero.headlineItalic}
          </span>
        </motion.h1>

        {/* Beat 3 — subline + CTA group: pinned to the bottom of the hero on
            mobile (mt-auto), where it sat naturally in the flow before */}
        <div className="mt-auto sm:mt-0">
          <motion.p
            {...beat(0.5)}
            className="pl-1.5 sm:pl-0 font-sans text-on-brand"
            style={{
              fontSize: "clamp(15px, 4vw, 21px)",
              lineHeight: 1.5,
              maxWidth: "480px",
              margin: "24px 0 0",
              textWrap: "pretty",
            }}
          >
            {hero.subline}
          </motion.p>

          {/* Beat 4 — CTA (with subline, video-end) */}
          <motion.div
            {...beat(0.5)}
            className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-9"
          >
            <Button variant="solid" size="lg" href={hero.ctaPrimary.href}>
              {hero.ctaPrimary.label}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
