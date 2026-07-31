import type { IconProps } from './Icon.types'

function PhoneIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5.6 6.9c.7 1.5 1.9 2.7 3.4 3.4l.9-1.1c.2-.3.6-.4.9-.3.9.3 1.9.5 2.9.5.5 0 .9.4.9.9v2.3c0 .5-.4.9-.9.9C7.1 13.5 2.5 8.9 2.5 3.2c0-.5.4-.9.9-.9h2.3c.5 0 .9.4.9.9 0 1 .2 2 .5 2.9.1.3 0 .7-.3.9l-1.2.9z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default PhoneIcon
