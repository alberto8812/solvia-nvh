import { useState } from "react";
import { motion } from "motion/react";
import { simulator } from "@/data";
import { AnimatedCounter } from "@/components/motion";
import { slideInLeft, EASE } from "@/components/motion";
import { Button, Container } from "@/components/ui";
import { openSolviaChat } from "@/lib/chat-bridge";

function fmt(n: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(n);
}

// Layout-aware variant: keeps y:56 in both states so the offset isn't disturbed
const cardVariant = {
  hidden: { opacity: 0, x: 24, y: 56 },
  visible: {
    opacity: 1,
    x: 0,
    y: 56,
    transition: { duration: 0.65, ease: EASE },
  },
};

const VP = { once: true, amount: 0.2 } as const;

export function AmountSelectorSection() {
  const [monto, setMonto] = useState(simulator.quickAmounts[0]);

  return (
    <section
      id="montos"
      className="relative bg-brand-900 pt-14 pb-16 md:pt-[76px] md:pb-[120px]"
    >
      <Container className="lg:grid lg:grid-cols-[440px_1fr] lg:items-center lg:gap-16">
        {/* Heading — slides from left */}
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <div className="font-mono text-xs tracking-[.14em] uppercase text-brand-300">
            Valores disponíveis
          </div>
          <h2
            className="font-sans font-semibold mt-[14px] mb-4 text-on-brand"
            style={{
              fontSize: "clamp(26px, 6vw, 34px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.12,
              textWrap: "balance",
            }}
          >
            Escolha o valor{" "}
            <span className="font-serif italic font-medium">
              que você gostaria de solicitar.
            </span>
          </h2>
          <p
            className="text-sm leading-[1.6] mt-3 text-brand-300"
            style={{ maxWidth: "440px" }}
          >
            {simulator.rangeSubtext}
          </p>
        </motion.div>

        {/* Floating selector card — slides from right, y:56 maintained */}
        <motion.div
          variants={cardVariant}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="bg-neutral-50 p-6 md:p-9 mt-8 lg:mt-0 w-full lg:max-w-[620px]"
          style={{
            borderRadius: "12px",
            boxShadow: "var(--shadow-brand-xl)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: amount pills */}
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-neutral-600 shrink-0">
                  Valor
                </span>
                <div className="flex gap-2 flex-wrap">
                  {simulator.quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setMonto(amt)}
                      className={`font-mono text-sm font-medium px-4 py-2.5 rounded-full cursor-pointer transition-all duration-300 border ${
                        monto === amt
                          ? "border-brand-900 bg-brand-900 text-on-brand"
                          : "border-neutral-300 bg-neutral-50 text-neutral-600"
                      }`}
                    >
                      {fmt(amt)}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[13px] leading-[1.6] mt-4 text-neutral-500">
                Precisa de outro valor? Fale com a gente pelo WhatsApp e te
                orientamos.
              </p>
            </div>

            {/* Right: confirmation + CTA */}
            <div className="flex flex-col justify-center rounded-[10px] px-6 py-8 bg-brand-50 border border-accent-500/50">
              <div className="text-[13px] tracking-[.04em] text-brand-600">
                Valor selecionado
              </div>
              <AnimatedCounter
                value={monto}
                format={fmt}
                className="font-serif italic mt-1.5 text-brand-900"
                style={{
                  fontSize: "clamp(32px, 8vw, 44px)",
                  lineHeight: 1.02,
                  fontVariantNumeric: "tabular-nums",
                }}
              />

              <Button
                variant="whatsapp"
                onClick={() => openSolviaChat({ monto: fmt(monto) })}
                className="mt-[18px] justify-center w-full"
              >
                Solicitar pelo WhatsApp
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
