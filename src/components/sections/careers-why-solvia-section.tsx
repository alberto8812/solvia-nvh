import { motion } from 'motion/react'
import { jobsPage } from '@/data'
import { IconChip, cardClassName, cardStyle } from '@/components/ui'
import { fadeUp, staggerContainer, staggerItem } from '@/components/motion'

const VP = { once: true, amount: 0.2 } as const

export function CareersWhySolviaSection() {
  return (
    <motion.div
      className="mt-10 md:mt-14 pt-10 md:pt-12 border-t border-neutral-200"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
    >
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        {jobsPage.whySolvia.map((item) => (
          <motion.div
            key={item.title}
            variants={staggerItem}
            className={`${cardClassName()} p-5`}
            style={cardStyle()}
          >
            <IconChip icon={item.icon} size={44} />
            <h3
              className="font-sans font-semibold text-brand-900"
              style={{ fontSize: '16px', letterSpacing: '-0.01em', margin: '16px 0 6px' }}
            >
              {item.title}
            </h3>
            <p className="text-[14px] leading-[1.55] m-0 text-neutral-600" style={{ textWrap: 'pretty' }}>
              {item.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
