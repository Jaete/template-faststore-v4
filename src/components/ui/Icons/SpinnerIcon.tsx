import type { IconProps } from './Icon.types'

function SpinnerIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M14 8a6 6 0 1 1-6-6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 8 8"
          to="360 8 8"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  )
}

export default SpinnerIcon
