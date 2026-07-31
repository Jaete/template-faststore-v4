import type { IconProps } from './Icon.types'

function PinIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8 14.5s5-4.2 5-8.2A5 5 0 0 0 3 6.3c0 4 5 8.2 5 8.2z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.3" r="1.8" stroke={color} strokeWidth="1.2" />
    </svg>
  )
}

export default PinIcon
