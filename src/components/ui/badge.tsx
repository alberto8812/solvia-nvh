import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
  tone?: 'brand' | 'success'
}

const TONE_CLASSES: Record<Required<BadgeProps>['tone'], string> = {
  brand: 'text-brand-700 bg-brand-100',
  success: 'text-status-green bg-status-green/10',
}

export function Badge({ children, className = '', tone = 'brand' }: BadgeProps) {
  const classes = [
    'inline-flex items-center gap-1.5 shrink-0 font-mono text-[11px] font-medium tracking-[.04em] uppercase px-2.5 py-1 rounded-full',
    TONE_CLASSES[tone],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{children}</span>
}
