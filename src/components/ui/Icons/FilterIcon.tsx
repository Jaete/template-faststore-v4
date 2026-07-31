import type { IconProps } from './Icon.types'

// Sliders horizontais — ícone do controle "Filtrar por".
function FilterIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M2.667 4h10.666M2.667 8h10.666M2.667 12h10.666"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="6"
        cy="4"
        r="1.6"
        fill="#fff"
        stroke={color}
        strokeWidth="1.2"
      />
      <circle
        cx="10.333"
        cy="8"
        r="1.6"
        fill="#fff"
        stroke={color}
        strokeWidth="1.2"
      />
      <circle
        cx="5.333"
        cy="12"
        r="1.6"
        fill="#fff"
        stroke={color}
        strokeWidth="1.2"
      />
    </svg>
  )
}

export default FilterIcon
