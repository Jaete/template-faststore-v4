export interface TabbedShelfTab {
  label: string
  /** ID da coleção (productClusterId) para buscar produtos dela. */
  collectionId?: string
  /** ID/slug da categoria (nível 1) para buscar produtos dela. */
  categoryId?: string
  /** Busca os produtos mais vendidos (sort orders_desc). */
  bestSellers?: boolean
  /** Quantidade de produtos exibidos. */
  numberOfItems?: number
}

export interface TabbedShelfProps {
  title?: string
  /** Quantidade de itens já visíveis no início de cada vitrine — define as posições de dots/setas. */
  visibleItems?: number
  tabs: TabbedShelfTab[]
}
