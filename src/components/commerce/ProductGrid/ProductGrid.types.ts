/**
 * Item de faceta permitida vindo do CMS. É um objeto `{ label }` (e não string
 * pura) porque o editor RJSF da VTEX só hidrata o `default` de array quando os
 * itens são objetos. Strings puras são aceitas por compatibilidade com
 * conteúdo antigo — a normalização acontece em ProductGrid.
 */
export type AllowedFacetItem = string | { label?: string }

export interface ProductGridProps {
  /** Mensagem exibida quando a categoria não retorna nenhum produto */
  emptyStateMessage?: string
  /** Mensagem exibida quando o filtro de faixa de preço zera todos os produtos */
  priceEmptyStateMessage?: string
  /** Label do botão de paginação incremental */
  loadMoreLabel?: string
  /** Facetas de especificação (case-insensitive) que podem aparecer nos filtros */
  allowedFacets?: AllowedFacetItem[]
}

export interface ProductGridContentProps {
  emptyStateMessage: string
  priceEmptyStateMessage: string
  loadMoreLabel: string
  allowedFacets: string[]
}
