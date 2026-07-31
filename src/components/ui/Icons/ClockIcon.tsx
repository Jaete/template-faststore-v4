import type { IconProps } from './Icon.types'

function ClockIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.2" />
      <path
        d="M8 4.8v3.4l2.4 1.4"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ClockIcon
