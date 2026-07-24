import { motion } from "motion/react";
import { about } from "@/data";
import { Container, Icon } from "@/components/ui";
import {
  fadeUp,
  slideInLeft,
  staggerContainer,
  staggerItem,
} from "@/components/motion";

const VP = { once: true, amount: 0.25 } as const;

export function AboutSection() {
  return (
    <section
      id="nosotros"
      className="bg-brand-900 py-14 md:py-[76px]"
    >
      <Container className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      {/* Text — slides from left */}
      <motion.div
        variants={slideInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        <div className="font-mono text-xs tracking-[.14em] uppercase text-brand-300">
          {about.eyebrow}
        </div>
        <h2
          className="font-serif italic font-normal text-on-brand"
          style={{
            fontSize: "clamp(28px, 7vw, 38px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            textWrap: "balance",
            margin: "14px 0 18px",
          }}
        >
          {about.headline}
        </h2>
        <p
          className="text-base leading-[1.65] text-brand-200"
          style={{ margin: '0 0 24px' }}
        >
          {about.body}
        </p>
        {/* <Button variant="accent" href={about.cta.href}>
          {about.cta.label}
        </Button> */}
      </motion.div>

      {/* Image — slides from right */}
      {/* <motion.div
        variants={slideInRight}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
        className="relative rounded-xl overflow-hidden bg-brand-800 aspect-[4/3] md:aspect-auto md:min-h-[340px]"
      >
        <img
          src={about.image}
          alt="Equipe Solvia"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'saturate(0.88) contrast(1.02)' }}
          loading="lazy"
        />
      </motion.div> */}

      {/* Values — full width, stagger */}
      <motion.div
        className="col-span-1 md:col-span-2 mt-2 md:mt-2 pt-2 md:pt-1 "
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          {about.values.map((v) => (
            <motion.div
              key={v.title}
              variants={staggerItem}
              className="rounded-lg border border-on-brand/10 bg-on-brand/[0.04] p-5"
            >
              <div
                className="flex items-center justify-center text-brand-200"
                style={{ width: "46px", height: "46px" }}
              >
                <Icon name={v.icon} size={32} />
              </div>
              <h3
                className="font-sans font-semibold text-on-brand"
                style={{
                  fontSize: "16px",
                  letterSpacing: "-0.01em",
                  margin: "16px 0 6px",
                }}
              >
                {v.title}
              </h3>
              <p
                className="text-[14px] leading-[1.55] m-0 text-brand-200"
                style={{ textWrap: "pretty" }}
              >
                {v.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      </Container>
    </section>
  );
}
