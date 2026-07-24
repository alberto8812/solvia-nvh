import type { ReactNode } from 'react'

interface EyebrowProps {
  size?: 'md' | 'sm'
  className?: string
  children: ReactNode
}

const sizes: Record<NonNullable<EyebrowProps['size']>, string> = {
  md: 'font-mono text-xs tracking-[.14em] uppercase text-neutral-400',
  sm: 'font-mono text-[11px] tracking-[.1em] uppercase text-neutral-400',
}

export function Eyebrow({ size = 'md', className = '', children }: EyebrowProps) {
  const classes = [sizes[size], className].filter(Boolean).join(' ')

  return <div className={classes}>{children}</div>
}
