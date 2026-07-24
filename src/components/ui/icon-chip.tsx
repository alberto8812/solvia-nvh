import { AppIcon } from './app-icon'

interface IconChipProps {
  icon: string
  size?: number
  iconSize?: number
  radius?: number
  /** Icon color classes. Defaults to the corporate brand color, no background. */
  colorClassName?: string
  /** Extra classes appended to the chip wrapper (e.g. `shrink-0`). */
  className?: string
}

export function IconChip({
  icon,
  size = 44,
  iconSize,
  radius = 9,
  colorClassName = 'text-brand-900',
  className = '',
}: IconChipProps) {
  return (
    <div
      className={`flex items-center justify-center ${colorClassName} ${className}`.trim()}
      style={{ width: `${size}px`, height: `${size}px`, borderRadius: `${radius}px` }}
    >
      <AppIcon name={icon} size={iconSize ?? Math.round(size * 0.7)} />
    </div>
  )
}
