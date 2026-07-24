import { motion } from "motion/react";
import { steps } from "@/data";
import { fadeUp, EASE } from "@/components/motion";
import { Container } from "@/components/ui";

const VP = { once: true, amount: 0.2 } as const;

export function StepsSection() {
  return (
    <section
      id="como-funciona"
      className="bg-neutral-50 pt-16 pb-12 md:pt-[120px] md:pb-[76px]"
    >
      <Container>
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        <div className="font-mono text-xs tracking-[.14em] uppercase text-neutral-400">
          Como funciona
        </div>
        <h2
          className="font-sans font-semibold mt-[14px] text-brand-900"
          style={{
            fontSize: "clamp(26px, 6vw, 34px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            maxWidth: "520px",
            textWrap: "balance",
            marginBottom: "44px",
          }}
        >
          Como solicitar{" "}
          <span className="font-serif italic font-medium">seu crédito</span>
        </h2>
      </motion.div>

      {/* Steps — each child gets its own whileInView + delay; the grid container has overflow:hidden
          so we can't use a staggerContainer wrapper (IntersectionObserver can't observe display:contents) */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-neutral-200 bg-neutral-50"
        style={{
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {steps.map((p, i) => {
          const isLast = i === steps.length - 1;
          const isLastMdCol = i % 2 === 1;
          const isMdSecondRow = i >= 2;
          const borderClasses = [
            !isLast && "border-b",
            isMdSecondRow ? "md:border-b-0" : "md:border-b",
            "lg:border-b-0",
            !isLastMdCol && "md:border-r",
            !isLast && "lg:border-r",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: i * 0.1 }}
              viewport={VP}
              className={`px-6 py-7 md:px-[30px] md:py-[34px] border-neutral-200 ${borderClasses}`}
            >
              <div className="font-mono text-[13px] tracking-[.08em] text-brand-500">
                PASSO {p.n}
              </div>
              <h3
                className="font-sans font-semibold text-brand-900"
                style={{ fontSize: "20px", margin: "14px 0 8px" }}
              >
                {p.t}
              </h3>
              <p className="text-[15px] leading-[1.55] m-0 text-neutral-600">
                {p.d}
              </p>
            </motion.div>
          );
        })}
      </div>
      </Container>
    </section>
  );
}
