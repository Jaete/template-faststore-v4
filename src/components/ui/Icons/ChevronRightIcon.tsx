import type { IconProps } from './Icon.types'

function ChevronRightIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ChevronRightIcon
