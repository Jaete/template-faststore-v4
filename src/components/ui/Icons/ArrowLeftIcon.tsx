import type { IconProps } from './Icon.types'

function ArrowLeftIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M19 12H5M12 19L5 12L12 5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ArrowLeftIcon
