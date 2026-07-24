import type { ReactNode } from 'react'

interface ButtonProps {
  variant?: 'primary' | 'accent' | 'outline' | 'whatsapp' | 'solid' | 'whatsapp-outline'
  size?: 'md' | 'lg'
  icon?: ReactNode
  href?: string
  target?: string
  rel?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  children: ReactNode
  className?: string
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-brand-900 text-on-brand hover:bg-brand-800 transition-colors duration-300',
  accent:
    'bg-brand-300 text-brand-900 border border-brand-300 hover:bg-brand-200 transition-colors duration-300',
  outline:
    'bg-transparent text-brand-300 border border-brand-600 hover:border-brand-500 hover:bg-brand-900/30 transition-colors duration-300',
  whatsapp:
    'bg-whatsapp text-on-brand hover:bg-whatsapp-hover transition-colors duration-300',
  solid:
    'bg-neutral-50 text-brand-900 border border-neutral-50 hover:bg-brand-100 transition-colors duration-300',
  'whatsapp-outline':
    'bg-transparent text-whatsapp border border-whatsapp hover:bg-whatsapp/10 transition-colors duration-300',
}

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  md: 'text-sm font-semibold px-[18px] py-2.5',
  lg: 'text-base font-semibold px-[26px] py-[15px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  href,
  target,
  rel,
  type = 'button',
  onClick,
  children,
  className = '',
}: ButtonProps) {
  const cls = [
    'inline-flex items-center justify-center gap-2 rounded-md outline-none cursor-pointer',
    variants[variant],
    sizes[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={cls}>
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={cls}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  )
}
