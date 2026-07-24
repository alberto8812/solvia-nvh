import type { ReactNode } from 'react'

interface HeadingProps {
  level: 1 | 2 | 3 | 4
  color?: 'dark' | 'accent' | 'cream'
  children: ReactNode
  className?: string
}

const colorClasses: Record<NonNullable<HeadingProps['color']>, string> = {
  dark: 'text-dark',
  accent: 'text-accent',
  cream: 'text-cream',
}

const sizeClasses: Record<HeadingProps['level'], string> = {
  1: 'text-5xl',
  2: 'text-4xl',
  3: 'text-2xl',
  4: 'text-xl',
}

export function Heading({
  level,
  color = 'cream',
  children,
  className = '',
}: HeadingProps) {
  const classes = [
    'font-display',
    colorClasses[color],
    sizeClasses[level],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4'

  return <Tag className={classes}>{children}</Tag>
}
