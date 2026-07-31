import { useSearch } from '@faststore/sdk'
import { usePLP, isPLP } from '@faststore/core'
import {
  useDelayedPagination_unstable as useDelayedPagination,
  useProductsPrefetch_unstable as useProductsPrefetch,
} from '@faststore/core/experimental'
import type { SearchSort } from './ProductGridToolbar/ProductGridToolbar.types'
import { useCallback } from 'react'

import { useDisplayedCount } from './DisplayedCountContext/DisplayedCountContext'
import { PRICE_FACET_KEY } from '../Filters/PriceRangeFacet/priceRange'

export function useProductGrid() {
  const context = usePLP()
  const { pages, addNextPage, state, setState, resetInfiniteScroll } =
    useSearch()
  const { totalDisplayed } = useDisplayedCount()

  const data = isPLP(context) ? context.data : undefined
  const totalCount = data?.search?.products?.pageInfo?.totalCount ?? 0

  const { next, prev } = useDelayedPagination(totalCount)

  useProductsPrefetch(prev ? prev.cursor : null)
  useProductsPrefetch(next ? next.cursor : null)

  const handleLoadMore = useCallback(() => {
    addNextPage()
  }, [addNextPage])

  // Trocar a ordenação reordena o resultado inteiro, então as páginas
  // acumuladas pelo "carregar mais" deixam de fazer sentido: voltamos para a
  // primeira página (`resetInfiniteScroll(0)`) além de atualizar o `sort`.
  const handleSortChange = useCallback(
    (sort: SearchSort) => {
      if (sort === state.sort) {
        return
      }

      setState({ ...state, sort })
      resetInfiniteScroll(0)
    },
    [state, setState, resetInfiniteScroll]
  )

  const hasNextPage = Boolean(next)
  const hasProductsLoaded = Boolean(data?.search?.products)
  const isEmpty = hasProductsLoaded && totalCount === 0

  // Vazio por preço: com o filtro server-side, o `totalCount` já vem 0 tanto na
  // categoria vazia quanto na faixa sem produtos — não há mais como distinguir
  // por contagem de cards. A distinção agora é "há filtro de preço ativo?", que
  // é o que muda a mensagem exibida. Refinamento de `isEmpty`, não alternativa:
  // quem consome tem que testar este PRIMEIRO (ver ProductGrid.tsx).
  const isEmptyByPrice =
    isEmpty &&
    state.selectedFacets.some((facet) => facet.key === PRICE_FACET_KEY)

  return {
    pages,
    totalCount,
    handleLoadMore,
    hasNextPage,
    isEmpty,
    isEmptyByPrice,
    totalDisplayed,
    sort: state.sort,
    handleSortChange,
  }
}
