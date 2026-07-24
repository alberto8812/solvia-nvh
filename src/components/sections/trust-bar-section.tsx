import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { stats } from '@/data'
import { staggerContainer, staggerItem, EASE } from '@/components/motion'
import { Container } from '@/components/ui'

function StatContent({ s }: { s: (typeof stats)[number] }) {
  return (
    <>
      <div
        className="font-serif italic text-brand-300"
        style={{ fontSize: '34px', lineHeight: 1 }}
      >
        {s.v}
      </div>
      <div className="text-[13px] mt-2 text-brand-200">{s.l}</div>
      {s.d && <div className="text-[11px] mt-1 text-brand-300">{s.d}</div>}
    </>
  )
}

export function TrustBarSection() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % stats.length)
    }, 4500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-brand-800 py-7">
      <Container>
        {/* Mobile: auto-rotating carousel, one stat at a time */}
        <div className="sm:hidden text-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <StatContent s={stats[index]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* sm and up: static grid */}
        <motion.div
          className="hidden sm:grid sm:grid-cols-4 sm:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {stats.map((s) => (
            <motion.div key={s.l} variants={staggerItem} className="text-center">
              <StatContent s={s} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </div>
  )
}
