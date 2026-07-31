import type { SVGProps } from 'react'

/**
 * Caret dentro de um círculo apontando para cima (variante "thin"). 40×40.
 * Usado nas setas de navegação do rail de thumbnails da galeria.
 */
function CaretCircleUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <circle
        cx="20"
        cy="20"
        r="15.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M14 22.5L20 16.5L26 22.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default CaretCircleUpIcon
