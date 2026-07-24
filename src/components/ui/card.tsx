import type { CSSProperties } from 'react'

interface CardStyleOptions {
  interactive?: boolean
  radius?: number
}

export function cardClassName({ interactive = false }: CardStyleOptions = {}): string {
  return ['solvia-card', interactive ? 'cursor-pointer' : '', 'bg-neutral-50 border border-neutral-200']
    .filter(Boolean)
    .join(' ')
}

export function cardStyle({ radius = 10 }: CardStyleOptions = {}): CSSProperties {
  return { borderRadius: `${radius}px` }
}
