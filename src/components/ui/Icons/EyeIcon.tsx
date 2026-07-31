import type { IconProps } from './Icon.types'

function EyeIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" {...props}>
      <path
        d="M0.75 9S3.75 3 9 3s8.25 6 8.25 6-3 6-8.25 6S0.75 9 0.75 9Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="2.25" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

export default EyeIcon
