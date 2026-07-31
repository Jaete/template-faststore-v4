import type { IconProps } from './Icon.types'

function PlusIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8 3v10M3 8h10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default PlusIcon
