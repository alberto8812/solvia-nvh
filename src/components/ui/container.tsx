import type { ElementType, HTMLAttributes } from 'react'

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  className?: string
}

export function Container({ as: Tag = 'div', className = '', ...props }: ContainerProps) {
  const cls = ['mx-auto w-full max-w-[1280px] px-5 sm:px-8 md:px-12', className]
    .filter(Boolean)
    .join(' ')

  return <Tag className={cls} {...props} />
}
