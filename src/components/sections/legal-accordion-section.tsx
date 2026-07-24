import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { legal } from "@/data";
import { staggerContainer, staggerItem } from "@/components/motion";
import { Container } from "@/components/ui";

const VP = { once: true, amount: 0.2 } as const;

export function LegalAccordionSection() {
  const { hash } = useLocation();
  const [openId, setOpenId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Deep-link from the footer (e.g. /legal#termos): open the matching
  // document and scroll it into view once its ref is mounted.
  useEffect(() => {
    const id = hash.replace("#", "");
    if (!id || !legal.documents.some((doc) => doc.id === id)) return;
    setOpenId(id);
    cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <section className="bg-neutral-50 border-t border-neutral-200 pt-[calc(70px+56px)] md:pt-[calc(70px+76px)] pb-14 md:pb-[76px]">
      <Container style={{ maxWidth: "760px" }}>
        <div className="text-center">
          <div className="font-mono text-xs tracking-[.14em] uppercase text-neutral-400">
            {legal.eyebrow}
          </div>
          <h1
            className="font-sans font-semibold mt-[14px] text-brand-900"
            style={{
              fontSize: "clamp(30px, 6vw, 44px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              textWrap: "balance",
            }}
          >
            {legal.title}
          </h1>
          <p className="mt-4 text-[15px] leading-[1.6] text-neutral-500">
            {legal.subtitle}
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="mt-10 flex flex-col gap-3"
        >
          {legal.documents.map((doc) => {
            const open = openId === doc.id;
            const panelId = `legal-panel-${doc.id}`;
            const buttonId = `legal-trigger-${doc.id}`;
            return (
              <motion.div
                key={doc.id}
                ref={(el) => {
                  cardRefs.current[doc.id] = el;
                }}
                variants={staggerItem}
                className="solvia-card bg-white border border-neutral-200 overflow-hidden"
                style={{ borderRadius: "10px", scrollMarginTop: "100px" }}
              >
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => setOpenId(open ? null : doc.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex w-full items-center gap-4 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                >
                  <div className="flex-1">
                    <div className="font-sans font-semibold text-[16px] text-brand-900">
                      {doc.title}
                    </div>
                    <div className="mt-1 text-[13px] text-neutral-400">
                      Atualizado: {doc.updatedAt}
                    </div>
                  </div>
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
                    <div className="flex flex-col gap-5 px-6 pb-6 pt-1 border-t border-neutral-100">
                      {doc.sections.map((section) => (
                        <div key={section.heading}>
                          <h2 className="font-sans font-semibold text-[14.5px] text-brand-900">
                            {section.heading}
                          </h2>
                          <p className="mt-1.5 text-[14.5px] leading-[1.6] text-neutral-600">
                            {section.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
