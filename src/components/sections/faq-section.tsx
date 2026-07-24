import { useState } from "react";
import { motion } from "motion/react";
import { faq } from "@/data";
import {
  staggerContainer,
  staggerItem,
  slideInLeft,
} from "@/components/motion";
import { Container } from "@/components/ui";

const VP = { once: true, amount: 0.2 } as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="preguntas-frecuentes"
      className="bg-neutral-50 border-t border-neutral-200 py-14 md:py-[76px]"
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Container className="lg:grid lg:grid-cols-[440px_1fr] lg:items-start lg:gap-16">
        {/* Heading + WhatsApp fallback — slides from left, sticky on desktop */}
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="lg:sticky lg:top-28"
        >
          <div className="font-mono text-xs tracking-[.14em] uppercase text-neutral-400">
            Perguntas frequentes
          </div>
          <h2
            className="font-sans font-semibold mt-[14px] text-brand-900"
            style={{
              fontSize: "clamp(26px, 6vw, 34px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.12,
              textWrap: "balance",
            }}
          >
            O que mais nos{" "}
            <span className="font-serif italic font-medium">perguntam.</span>
          </h2>
          <div
            className="mt-8 pt-6 border-t border-neutral-200 hidden lg:block"
            style={{ maxWidth: "360px" }}
          >
            <p className="text-[13px] leading-[1.6] text-neutral-500">
              Sua pergunta não está aqui? Fale com a gente pelo WhatsApp e te
              respondemos em minutos.
            </p>
          </div>
        </motion.div>

        {/* Accordion list */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="mt-10 lg:mt-0 flex flex-col gap-3"
        >
          {faq.map((item, i) => {
            const open = openIndex === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-trigger-${i}`;
            return (
              <motion.div
                key={item.q}
                variants={staggerItem}
                className="solvia-card bg-white border border-neutral-200 overflow-hidden"
                style={{ borderRadius: "10px" }}
              >
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex w-full items-center gap-4 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                >
                  <span
                    className="flex items-center justify-center flex-shrink-0 font-mono text-xs transition-colors duration-300"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "8px",
                      background: open
                        ? "var(--color-brand-900)"
                        : "var(--color-neutral-100)",
                      color: open
                        ? "var(--color-brand-300)"
                        : "var(--color-neutral-500)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-sans font-semibold text-[16px] text-brand-900">
                    {item.q}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-neutral-400 transition-transform duration-300"
                    style={{
                      transform: open ? "rotate(180deg)" : "rotate(0deg)",
                      transitionTimingFunction: "var(--ease-out)",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="grid transition-[grid-template-rows] duration-300"
                  style={{
                    gridTemplateRows: open ? "1fr" : "0fr",
                    transitionTimingFunction: "var(--ease-out)",
                  }}
                >
                  <div className="overflow-hidden min-h-0">
                    <p className="text-[14.5px] leading-[1.6] text-neutral-600 px-6 pb-5 pl-[70px] m-0">
                      {item.a}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* WhatsApp fallback — mobile only, desktop version lives in the left column */}
          <div className="mt-2 pt-5 border-t border-neutral-200 lg:hidden">
            <p className="text-[13px] leading-[1.6] text-neutral-500">
              Sua pergunta não está aqui? Fale com a gente pelo WhatsApp e te
              respondemos em minutos.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
