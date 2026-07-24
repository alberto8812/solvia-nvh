import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { legal } from "@/data";
import { Container } from "@/components/ui";

const CONTENT_EASE = [0.2, 0.8, 0.2, 1] as const;

export function LegalAccordionSection() {
  const { hash } = useLocation();
  const [selectedId, setSelectedId] = useState(legal.documents[0].id);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Deep-link from the footer (e.g. /legal#pldft): select the matching
  // document and bring the fixed-size viewer into view — the viewer itself
  // never changes height, so this never causes the page-jump the accordion
  // version had.
  useEffect(() => {
    const id = hash.replace("#", "");
    if (!id || !legal.documents.some((doc) => doc.id === id)) return;
    setSelectedId(id);
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  const selectedDoc =
    legal.documents.find((doc) => doc.id === selectedId) ?? legal.documents[0];

  // On mobile the list sits above a tall viewer, so picking a document can
  // leave its content below the fold with no visible change — bring the
  // viewer into view on selection there. Desktop keeps list and viewer side
  // by side (already both in view), so it's skipped to avoid an unwanted
  // scroll jump on click.
  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (window.innerWidth < 1024) {
      requestAnimationFrame(() =>
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  };

  return (
    <section className="bg-neutral-50 border-t border-neutral-200 pt-[calc(70px+56px)] md:pt-[calc(70px+76px)] pb-14 md:pb-[76px]">
      <Container style={{ maxWidth: "980px" }}>
        <div className="text-center mx-auto" style={{ maxWidth: "640px" }}>
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

        <div
          ref={panelRef}
          className="mt-10 lg:grid lg:grid-cols-[280px_1fr] lg:items-start gap-3 lg:gap-6"
          style={{ scrollMarginTop: "100px" }}
        >
          {/* Mobile/tablet — compact horizontal chip selector, sitting
              directly above the viewer so switching documents and seeing
              the result happen in the same glance, no scrolling required. */}
          <nav
            aria-label="Documentos"
            className="lg:hidden flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 sm:-mx-8 sm:px-8 md:-mx-12 md:px-12"
            style={{ scrollSnapType: "x proximity" }}
          >
            {legal.documents.map((doc) => {
              const selected = doc.id === selectedDoc.id;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => handleSelect(doc.id)}
                  aria-current={selected}
                  className="shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                  style={{
                    scrollSnapAlign: "start",
                    background: selected ? "var(--color-brand-900)" : "#ffffff",
                    color: selected ? "#ffffff" : "var(--color-neutral-600)",
                    border: `1px solid ${
                      selected ? "var(--color-brand-900)" : "var(--color-neutral-200)"
                    }`,
                    boxShadow: selected ? "var(--shadow-brand-sm)" : "none",
                  }}
                >
                  {doc.shortTitle ?? doc.title}
                </button>
              );
            })}
          </nav>

          {/* Desktop — full document index, quiet navigation beside the
              viewer, never changes height. */}
          <nav aria-label="Documentos" className="hidden lg:flex lg:flex-col gap-1.5">
            {legal.documents.map((doc) => {
              const selected = doc.id === selectedDoc.id;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => handleSelect(doc.id)}
                  aria-current={selected}
                  className="flex items-center gap-3 text-left pl-3.5 pr-3 py-3 rounded-[10px] border-l-[3px] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                  style={{
                    borderLeftColor: selected
                      ? "var(--color-accent-700)"
                      : "transparent",
                    background: selected ? "#ffffff" : "transparent",
                    boxShadow: selected ? "var(--shadow-brand-sm)" : "none",
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-sans text-[13.5px] leading-snug ${
                        selected
                          ? "font-semibold text-brand-900"
                          : "font-medium text-neutral-600"
                      }`}
                    >
                      {doc.title}
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-neutral-400">
                      Atualizado: {doc.updatedAt}
                    </div>
                  </div>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 transition-opacity duration-200"
                    style={{
                      color: "var(--color-accent-700)",
                      opacity: selected ? 1 : 0,
                    }}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              );
            })}
          </nav>

          {/* Fixed-size viewer — height never changes when switching
              documents; long content scrolls inside instead of pushing
              the page layout around. */}
          <div
            className="mt-3 lg:mt-0 flex flex-col bg-white border border-neutral-200 overflow-hidden h-[440px] md:h-[500px] lg:h-[600px]"
            style={{ borderRadius: "14px", boxShadow: "var(--shadow-brand-sm)" }}
          >
            <div className="shrink-0 px-6 md:px-7 py-5 border-b border-neutral-100">
              <div className="font-sans font-semibold text-[16px] text-brand-900">
                {selectedDoc.title}
              </div>
              <div className="mt-1 text-[12.5px] text-neutral-400">
                Atualizado: {selectedDoc.updatedAt}
              </div>
            </div>

            <div className="legal-scroll flex-1 min-h-0 overflow-y-auto px-6 md:px-7 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDoc.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: CONTENT_EASE }}
                  className="flex flex-col gap-5"
                >
                  {selectedDoc.sections.map((section) => (
                    <div key={section.heading}>
                      <h2 className="font-sans font-semibold text-[14.5px] text-brand-900">
                        {section.heading}
                      </h2>
                      <p className="mt-1.5 text-[14.5px] leading-[1.6] text-neutral-600">
                        {section.body}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
