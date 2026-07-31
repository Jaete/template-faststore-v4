import type { SearchState } from '@faststore/sdk'

// `SearchSort` não é re-exportado pelo barrel do SDK; derivamos do `sort` do
// estado da busca (que é exportado como `SearchState`).
export type SearchSort = SearchState['sort']

export interface ProductGridToolbarProps {
  /** Total de produtos da busca (contagem da VTEX, ignora paginação incremental). */
  total: number
  /** Critério de ordenação atual (controlado pelo estado da busca). */
  sort: SearchSort
  /** Dispara a troca de ordenação — o pai atualiza o estado da busca. */
  onSortChange: (sort: SearchSort) => void
}
