import { useEffect } from 'react'
import { useMotionValue, useSpring, useTransform, motion } from 'motion/react'

interface AnimatedCounterProps {
  value: number
  format: (n: number) => string
  className?: string
  style?: React.CSSProperties
}

export function AnimatedCounter({ value, format, className, style }: AnimatedCounterProps) {
  const mv = useMotionValue(value)
  const spring = useSpring(mv, { stiffness: 80, damping: 20, mass: 1 })
  const display = useTransform(spring, (v) => format(Math.round(v)))

  useEffect(() => {
    mv.set(value)
  }, [value, mv])

  return (
    <motion.span className={className} style={style}>
      {display}
    </motion.span>
  )
}
