import { motion } from "motion/react";
import { jobsPage } from "@/data";
import { Eyebrow, IconChip } from "@/components/ui";
import { fadeUp, staggerContainer, staggerItem } from "@/components/motion";

const VP = { once: true, amount: 0.2 } as const;

export function CareersExpectationsSection() {
  return (
    <motion.div
      className="mt-10 md:mt-14 pt-10 md:pt-12 border-t border-neutral-200"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
    >
      <Eyebrow className="mb-6">O que esperamos de você?</Eyebrow>
      <motion.ul
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0 m-0"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        {jobsPage.expectations.map((item) => (
          <motion.li
            key={item.label}
            variants={staggerItem}
            className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4"
          >
            <IconChip icon={item.icon} size={50} className="shrink-0" />
            <p className="text-[14px] text-neutral-700 m-0">{item.label}</p>
          </motion.li>
        ))}
      </motion.ul>
      <p className="text-[14px] leading-[1.55] text-neutral-600 mt-5">
        Importante: É necessário ter moto própria e residir na cidade da
        vaga.
      </p>
    </motion.div>
  );
}
