export interface SuggestionsShelfProps {
  title?: string
  /** ID da coleção (productClusterId) para buscar produtos dela. */
  collectionId?: string
  /** ID/slug da categoria (nível 1) para buscar produtos dela. */
  categoryId?: string
  /** Ignora collectionId/categoryId e busca pelo termo digitado na busca. */
  searchByTerm?: boolean
  /** Busca os produtos mais vendidos (sort orders_desc). */
  bestSellers?: boolean
  /** Quantidade de produtos exibidos. */
  numberOfItems?: number
}
