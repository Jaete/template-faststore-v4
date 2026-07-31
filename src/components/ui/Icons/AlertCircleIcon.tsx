import type { IconProps } from './Icon.types'

function AlertCircleIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M6.99996 12.8332C10.2216 12.8332 12.8333 10.2215 12.8333 6.99984C12.8333 3.77818 10.2216 1.1665 6.99996 1.1665C3.7783 1.1665 1.16663 3.77818 1.16663 6.99984C1.16663 10.2215 3.7783 12.8332 6.99996 12.8332Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 4.6665V7.77762"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 9.3335H7.00583"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default AlertCircleIcon
