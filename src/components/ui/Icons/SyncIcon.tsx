import type { IconProps } from './Icon.types'

function SyncIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M20 11a8 8 0 0 0-14.93-3.5M4 13a8 8 0 0 0 14.93 3.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 4v4h4M19.5 20v-4h-4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SyncIcon
