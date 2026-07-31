import type { IconProps } from './Icon.types'

function TrashIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M2 4h12M5.5 4V2.5a1 1 0 011-1h3a1 1 0 011 1V4m2 0v9a1.5 1.5 0 01-1.5 1.5H5A1.5 1.5 0 013.5 13V4m3 3.5v4m3-4v4"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default TrashIcon
