import type { SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  /**
   * Cor do ícone. Padrão: `currentColor` — herda a cor do CSS do elemento pai,
   * permitindo trocas de estado (ex: hover) só com CSS. Passar uma cor explícita
   * quando o ícone precisar de cor fixa independente do contexto.
   */
  color?: string
}
