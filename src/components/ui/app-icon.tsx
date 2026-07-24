import { Icon } from './icon'
import { hasIllustrativeIcon, IllustrativeIcon } from './illustrative-icon'

interface AppIconProps {
  name: string
  size?: number
  className?: string
}

// Renders the client-provided illustrative (fixed-color) icon when one exists
// for `name`, otherwise falls back to the monochrome currentColor icon set.
export function AppIcon({ name, size, className }: AppIconProps) {
  if (hasIllustrativeIcon(name)) {
    return <IllustrativeIcon name={name} size={size} className={className} />
  }
  return <Icon name={name} size={size} className={className} />
}
