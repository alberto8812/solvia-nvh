import { motion } from 'motion/react'
import { services } from '@/data'
import { Container, Icon } from '@/components/ui'
import { fadeUp, staggerContainer, staggerItem } from '@/components/motion'

const VP = { once: true, amount: 0.2 } as const

export function ServicesSection() {
  return (
    <section
      id="servicios"
      className="bg-neutral-100 border-t border-neutral-200 py-14 md:py-[76px]"
    >
      <Container>
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP}>
        <div className="font-mono text-xs tracking-[.14em] uppercase text-neutral-400">
          Nuestros servicios
        </div>
        <h2
          className="font-sans font-semibold mt-[14px] text-brand-900"
          style={{
            fontSize: 'clamp(26px, 6vw, 34px)',
            letterSpacing: '-0.02em',
            lineHeight: 1.12,
            maxWidth: '520px',
            textWrap: 'balance',
            marginBottom: '44px',
          }}
        >
          Un crédito para{' '}
          <span className="font-serif italic font-medium">cada momento</span> de tu vida.
        </h2>
      </motion.div>

      {/* Cards — stagger */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        {services.map((s) => (
          <motion.div
            key={s.t}
            variants={staggerItem}
            className="solvia-card flex gap-5 items-start bg-neutral-50 border border-neutral-200 p-6 md:p-[30px]"
            style={{
              borderRadius: '10px',
            }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0 bg-brand-900 text-brand-300"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '9px',
              }}
            >
              <Icon name={s.ic} size={22} />
            </div>
            <div>
              <h3
                className="font-sans font-semibold text-brand-900"
                style={{ fontSize: '19px', margin: '2px 0 8px' }}
              >
                {s.t}
              </h3>
              <p className="text-[15px] leading-[1.55] m-0 text-neutral-600">
                {s.d}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      </Container>
    </section>
  )
}
