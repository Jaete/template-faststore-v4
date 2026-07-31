import type { IconProps } from './Icon.types'

function MenuIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 6H21M3 12H21M3 18H21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MenuIcon
