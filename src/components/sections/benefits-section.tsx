import { motion } from "motion/react";
import { benefits } from "@/data";
import { AppIcon, Container } from "@/components/ui";
import { fadeUp, staggerContainer, staggerItem } from "@/components/motion";

const VP = { once: true, amount: 0.2 } as const;

export function BenefitsSection() {
  return (
    <section className="bg-neutral-50 py-14 md:py-[76px]">
      <Container>
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <div className="font-mono text-xs tracking-[.14em] uppercase text-neutral-400">
            Por que escolher a Solvia?
          </div>
          <h2
            className="font-sans font-semibold mt-[14px] text-brand-900"
            style={{
              fontSize: "clamp(26px, 6vw, 34px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.12,
              maxWidth: "560px",
              textWrap: "balance",
            }}
          >
            Benefícios de solicitar{" "}
            <span className="font-serif italic font-medium">seu crédito </span>{" "}
            na Solvia.
          </h2>
        </motion.div>

        {/* Cards — stagger */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mt-11"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          {benefits.map((b) => (
            <motion.div
              key={b.n}
              variants={staggerItem}
              className="solvia-card border border-neutral-200 bg-neutral-50"
              style={{
                padding: "32px 28px",
                borderRadius: "10px",
              }}
            >
              <div className="flex justify-between items-start">
                <div
                  className="flex items-center justify-center text-brand-900"
                  style={{ width: "46px", height: "46px" }}
                >
                  <AppIcon name={b.ic} size={50} />
                </div>
                <span
                  className="font-serif italic text-brand-300"
                  style={{ fontSize: "36px", lineHeight: 0.8 }}
                >
                  {b.n}
                </span>
              </div>
              <h3
                className="font-sans font-semibold text-brand-900"
                style={{
                  fontSize: "20px",
                  letterSpacing: "-0.01em",
                  margin: "20px 0 8px",
                }}
              >
                {b.t}
              </h3>
              <p
                className="text-[15px] leading-[1.55] m-0 text-neutral-600"
                style={{ textWrap: "pretty" }}
              >
                {b.d}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
