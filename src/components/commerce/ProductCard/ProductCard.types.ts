export interface ProductCardColorOption {
  label: string
  value: string
  /** Hex resolvido via paleta do CMS (ver src/components/providers/ColorPalette). */
  hex?: string
  /** URL da imagem-amostra da cor (campo de especificação "Cor" na VTEX), usada quando não há hex mapeado. */
  src?: string
  /** PDP do SKU dessa cor, já pré-selecionado. */
  href?: string
  selected?: boolean
  /** Cor branca precisa de um contorno fino para não sumir no fundo do card. */
  isWhite?: boolean
}

export type ProductCardVariant = 'default' | 'small'

export interface ProductCardData {
  image: {
    src: string
    alt: string
  }
  name: string
  href?: string
  listPrice: number
  sellingPrice: number
  colors?: ProductCardColorOption[]
}

export interface ProductCardProps {
  /** Ausente enquanto a vitrine carrega ou quando não há produto para o slot. */
  product?: ProductCardData
  /** Enquanto `true`, renderiza o skeleton no lugar do conteúdo do produto. */
  isLoading?: boolean
  maxVisibleColors?: number
  /**
   * 'small' é o layout compacto (usado obrigatoriamente no mobile) e também
   * pode ser aplicado no desktop, ex.: grids mais densos.
   */
  variant?: ProductCardVariant
  /**
   * Posição do card na grid, usada para escalonar o delay da animação de
   * entrada (slide-up + fade-in). Quando informado (>= 0), o card anima ao
   * montar; ausente/undefined renderiza sem animação.
   */
  animationIndex?: number
}
