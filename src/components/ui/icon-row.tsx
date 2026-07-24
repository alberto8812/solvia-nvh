import type { ReactNode } from 'react'
import { Icon } from './icon'

interface IconRowProps {
  icon: string
  iconSize?: number
  iconClassName?: string
  gapClassName?: string
  textClassName?: string
  href?: string
  className?: string
  children: ReactNode
}

export function IconRow({
  icon,
  iconSize = 14,
  iconClassName,
  gapClassName = 'gap-1.5',
  textClassName = 'text-[13px] text-neutral-500',
  href,
  className = '',
  children,
}: IconRowProps) {
  const classes = ['flex items-center', gapClassName, textClassName, className]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      <Icon name={icon} size={iconSize} className={iconClassName} />
      {children}
    </>
  )

  if (href) {
    return (
      <a href={href} className={`${classes} no-underline hover:text-brand-900 transition-colors`}>
        {content}
      </a>
    )
  }

  return <div className={classes}>{content}</div>
}
