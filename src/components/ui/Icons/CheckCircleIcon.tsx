import type { IconProps } from './Icon.types'

function CheckCircleIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M7.99996 14.6668C11.6819 14.6668 14.6666 11.6821 14.6666 8.00016C14.6666 4.31826 11.6819 1.3335 7.99996 1.3335C4.31806 1.3335 1.33329 4.31826 1.33329 8.00016C1.33329 11.6821 4.31806 14.6668 7.99996 14.6668Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.33329 8.00016L7.33329 10.0002L10.6666 6.00016"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default CheckCircleIcon
