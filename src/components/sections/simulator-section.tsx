import { useState } from 'react'
import { motion } from 'motion/react'
import { simulator } from '@/data'
import { AnimatedCounter } from '@/components/motion'
import { slideInLeft, EASE } from '@/components/motion'
import { Button, Container } from '@/components/ui'

function fmt(n: number): string {
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

function fmtPlazo(n: number): string {
  return `${n} meses`
}

function calcCuota(principal: number, months: number, rate: number): number {
  if (!rate || rate <= 0) return principal / months
  return (principal * rate) / (1 - Math.pow(1 + rate, -months))
}

// Layout-aware variant: keeps y:56 in both states so the offset isn't disturbed
const simCardVariant = {
  hidden: { opacity: 0, x: 24, y: 56 },
  visible: { opacity: 1, x: 0, y: 56, transition: { duration: 0.65, ease: EASE } },
}

const VP = { once: true, amount: 0.2 } as const

export function SimulatorSection() {
  const [monto, setMonto] = useState(simulator.montoDefault)
  const [plazo, setPlazo] = useState(simulator.plazoDefault)
  const rate = simulator.monthlyRate
  const cuota = calcCuota(monto, plazo, rate)
  const total = cuota * plazo

  return (
    <section
      id="simulador"
      className="relative bg-brand-900 pt-14 pb-16 md:pt-[76px] md:pb-[120px]"
    >
      <Container>
      {/* Heading — slides from left */}
      <motion.div
        style={{ maxWidth: '520px' }}
        variants={slideInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        <div className="font-mono text-xs tracking-[.14em] uppercase text-brand-300">
          Simulador de crédito
        </div>
        <h2
          className="font-sans font-semibold mt-[14px] mb-4 text-on-brand"
          style={{ fontSize: 'clamp(26px, 6vw, 34px)', letterSpacing: '-0.02em', lineHeight: 1.12, textWrap: 'balance' }}
        >
          Calcula tu crédito <span className="font-serif italic font-medium">en segundos.</span>
        </h2>
        <p className="text-base leading-[1.6] m-0 text-brand-200" style={{ maxWidth: '440px' }}>
          Mueve los controles para ver tu cuota estimada. Sin compromiso.
        </p>
      </motion.div>

      {/* Floating calculator card — slides from right, y:56 maintained */}
      <motion.div
        variants={simCardVariant}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
        className="bg-neutral-50 p-6 md:p-9"
        style={{
          maxWidth: '640px',
          margin: '32px auto 0',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-brand-xl)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: sliders */}
          <div>
            {/* Monto */}
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-neutral-600">Monto</span>
              <AnimatedCounter
                value={monto}
                format={fmt}
                className="font-mono text-lg font-medium text-brand-900"
              />
            </div>
            <input
              type="range"
              min={simulator.montoMin}
              max={simulator.montoMax}
              step={simulator.montoStep}
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              style={{ margin: '14px 0 4px' }}
            />
            <div className="flex justify-between text-[11px] font-mono text-neutral-400">
              <span>{fmt(simulator.montoMin)}</span>
              <span>{fmt(simulator.montoMax)}</span>
            </div>

            {/* Quick amounts */}
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {simulator.quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setMonto(amt)}
                  className={`font-mono text-[11.5px] font-medium px-2.5 py-1.5 rounded-full cursor-pointer transition-all duration-300 border ${
                    monto === amt ? 'border-brand-900 bg-brand-900 text-on-brand' : 'border-neutral-300 bg-neutral-50 text-neutral-600'
                  }`}
                >
                  {fmt(amt)}
                </button>
              ))}
            </div>

            {/* Plazo */}
            <div className="flex justify-between items-baseline mt-[22px]">
              <span className="text-sm font-medium text-neutral-600">Plazo</span>
              <AnimatedCounter
                value={plazo}
                format={fmtPlazo}
                className="font-mono text-lg font-medium text-brand-900"
              />
            </div>
            <input
              type="range"
              min={simulator.plazoMin}
              max={simulator.plazoMax}
              step={simulator.plazoStep}
              value={plazo}
              onChange={(e) => setPlazo(Number(e.target.value))}
              style={{ margin: '14px 0 4px' }}
            />
            <div className="flex justify-between text-[11px] font-mono text-neutral-400">
              <span>3 m</span>
              <span>36 m</span>
            </div>
          </div>

          {/* Right: result */}
          <div
            className="flex flex-col justify-center rounded-[10px] px-6 py-8 bg-brand-50 border border-accent-500/50"
          >
            <div className="text-[13px] tracking-[.04em] text-brand-600">
              Cuota mensual estimada
            </div>
            <AnimatedCounter
              value={cuota}
              format={fmt}
              className="font-serif italic mt-1.5 text-brand-900"
              style={{ fontSize: 'clamp(32px, 8vw, 44px)', lineHeight: 1.02, fontVariantNumeric: 'tabular-nums' }}
            />
            <div className="text-xs mt-2 text-neutral-500">
              Total:{' '}
              <AnimatedCounter value={total} format={fmt} style={{ fontVariantNumeric: 'tabular-nums' }} />
              <br />
              Tasa ejemplo {(rate * 100).toFixed(0)}%/mes
            </div>
            <Button
              variant="whatsapp"
              href={`https://wa.me/${simulator.waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-[18px] justify-center w-full"
            >
              Solicitar por WhatsApp
            </Button>
          </div>
        </div>
      </motion.div>
      </Container>
    </section>
  )
}
