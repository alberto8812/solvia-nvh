import { motion } from "motion/react";
import { coverage } from "@/data";
import { AppIcon, Container } from "@/components/ui";
import { fadeUp, staggerContainer, staggerItem } from "@/components/motion";

const VP = { once: true, amount: 0.25 } as const;

export function CoverageSection() {
  return (
    <section id="cobertura" className="py-14 md:py-[76px]">
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <div className="font-mono text-xs tracking-[.14em] uppercase text-brand-500">
            {coverage.eyebrow}
          </div>
          <h2
            className="font-serif italic font-normal text-brand-900"
            style={{
              fontSize: "clamp(28px, 7vw, 38px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              textWrap: "balance",
              margin: "14px 0 18px",
            }}
          >
            {coverage.headline}
          </h2>
          <p
            className="text-base leading-[1.65] text-brand-700"
            style={{ margin: "0 0 24px", maxWidth: "640px" }}
          >
            {coverage.intro}
          </p>
        </motion.div>

        {/* Locations */}
        <motion.div
          className="mt-10 md:mt-14 pt-10 md:pt-12 border-t border-brand-900/10"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <h3
            className="font-sans font-semibold text-brand-900"
            style={{
              fontSize: "18px",
              letterSpacing: "-0.01em",
              margin: "0 0 20px",
            }}
          >
            {coverage.headline}
          </h3>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            {coverage.locations.map((loc) => (
              <motion.div
                key={`${loc.city}-${loc.region}`}
                variants={staggerItem}
                className="flex items-center gap-3 rounded-lg border border-brand-900/10 bg-brand-50 p-4"
              >
                <div
                  className="flex items-center justify-center text-brand-900 shrink-0"
                  style={{ width: "38px", height: "38px" }}
                >
                  <AppIcon name="map-pin" size={50} />
                </div>
                <div>
                  <p
                    className="font-sans font-medium text-brand-900 m-0"
                    style={{ fontSize: "14px" }}
                  >
                    {loc.city}
                  </p>
                  <p
                    className="text-brand-600 m-0"
                    style={{ fontSize: "13px" }}
                  >
                    {loc.region}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Requirements */}
        <motion.div
          className="mt-10 md:mt-14 pt-10 md:pt-12 border-t border-brand-900/10"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <h3
            className="font-sans font-semibold text-brand-900"
            style={{
              fontSize: "18px",
              letterSpacing: "-0.01em",
              margin: "0 0 20px",
            }}
          >
            Requisitos para solicitar seu crédito
          </h3>
          <motion.ul
            className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none p-0 m-0"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            {coverage.requirements.map((req) => (
              <motion.li
                key={req.label}
                variants={staggerItem}
                className="flex items-center gap-3 rounded-lg border border-brand-900/10 bg-brand-50 p-4"
              >
                <div
                  className="flex items-center justify-center text-brand-900 shrink-0"
                  style={{ width: "32px", height: "32px" }}
                >
                  <AppIcon name={req.icon} size={50} />
                </div>
                <p className="text-brand-800 m-0" style={{ fontSize: "14px" }}>
                  {req.label}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </Container>
    </section>
  );
}
