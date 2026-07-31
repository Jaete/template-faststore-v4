import type { IconProps } from './Icon.types'

// Duas setas verticais opostas — ícone do controle "Ordenar por".
function SortIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.667 2v12M4.667 14l-2.334-2.333M11.333 14V2M11.333 2l2.334 2.333"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SortIcon
