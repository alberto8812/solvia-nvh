import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
}

export function Badge({ children, className = '' }: BadgeProps) {
  const classes = [
    'inline-flex items-center shrink-0 font-mono text-[11px] font-medium tracking-[.04em] uppercase text-brand-700 bg-brand-100 px-2.5 py-1 rounded-full',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{children}</span>
}
