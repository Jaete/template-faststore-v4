import type { Ref } from 'react'

import type { ProductCardVariant } from '../ProductCard/ProductCard.types'

export interface ShelfItemsInfo {
  /** Posições de navegação do carrossel: itens − visíveis + 1. */
  positionCount: number
  isLoading: boolean
}

export interface ShelfProps {
  title?: string
  /** ID da coleção (productClusterId) para buscar produtos dela. */
  collectionId?: string
  /** ID/slug da categoria (nível 1) para buscar produtos dela. */
  categoryId?: string
  /** Termo de busca para buscar produtos por relevância a ele. */
  term?: string
  /** Busca os produtos mais vendidos (sort orders_desc). */
  bestSellers?: boolean
  /** Quantidade de produtos exibidos. */
  numberOfItems?: number
  /**
   * Quantidade de itens já visíveis no início do carrossel. Como a navegação
   * avança de 1 em 1, define as posições reais de dots/setas:
   * `numberOfItems − visibleItems + 1`.
   */
  visibleItems?: number
  /** Variante repassada para cada ProductCard renderizado. */
  variant?: ProductCardVariant
  /** Ref do container do carrossel — repasse para controlar as setas por fora (ex.: `TabbedShelf`). */
  containerRef?: Ref<HTMLDivElement>
  /** Índice ativo do carrossel controlado externamente. */
  activeIndex?: number
  onActiveIndexChange?: (index: number) => void
  /** Notifica sempre que a quantidade de itens/loading mudar — usado por quem renderiza as setas por fora. */
  onItemsChange?: (info: ShelfItemsInfo) => void
  /** Desliga as setas internas. Usar quando outro componente as renderiza por fora (ex.: `TabbedShelf`). */
  showArrows?: boolean
  /** Exibe os dots de paginação abaixo do carrossel. */
  showPaginationDots?: boolean
}
