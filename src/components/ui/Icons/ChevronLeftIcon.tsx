import type { IconProps } from './Icon.types'

function ChevronLeftIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ChevronLeftIcon
