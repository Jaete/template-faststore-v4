import type { IconProps } from './Icon.types'

function MailIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <rect
        x="1.5"
        y="3.5"
        width="13"
        height="9"
        rx="1.2"
        stroke={color}
        strokeWidth="1.2"
      />
      <path
        d="M2 4.5l6 4.5 6-4.5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MailIcon
