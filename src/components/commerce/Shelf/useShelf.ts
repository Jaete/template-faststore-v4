import { useCallback, useEffect, useMemo, useState } from 'react'
import { useProductsQuery } from '@faststore/core'

import { mapProductToCard } from '../../../utils/mapProductToCard'
import { useColorPalette } from '../../providers/ColorPalette/useColorPalette'

import type { ShelfProps } from './Shelf.types'

type UseShelfParams = Required<
  Pick<ShelfProps, 'collectionId' | 'categoryId' | 'term' | 'bestSellers'>
> &
  Pick<ShelfProps, 'activeIndex' | 'onActiveIndexChange' | 'onItemsChange'> & {
    numberOfItems: number
    visibleItems: number
  }

function buildSelectedFacets(
  collectionId: string,
  categoryId: string
): Array<{ key: string; value: string }> {
  const facets: Array<{ key: string; value: string }> = []

  if (collectionId) {
    facets.push({ key: 'productClusterIds', value: collectionId })
  }

  if (categoryId) {
    facets.push({ key: 'category-1', value: categoryId })
  }

  return facets
}

export function useShelf({
  collectionId,
  categoryId,
  term,
  bestSellers,
  numberOfItems,
  visibleItems,
  activeIndex: controlledActiveIndex,
  onActiveIndexChange,
  onItemsChange,
}: UseShelfParams) {
  const palette = useColorPalette()

  const selectedFacets = useMemo(
    () => buildSelectedFacets(collectionId, categoryId),
    [collectionId, categoryId]
  )

  const data = useProductsQuery(
    {
      first: numberOfItems,
      sort: bestSellers ? 'orders_desc' : 'score_desc',
      term,
      selectedFacets,
    },
    // Sem boundary de Suspense no drawer de busca — sem isso, o fetch pendente
    // é lançado como promise não capturada e derruba a section inteira.
    { suspense: false }
  )

  // `data` é `undefined` antes da 1ª resolução e `null` no fallback do SWR —
  // ambos indicam que a busca ainda não retornou.
  const isLoading = !data

  const products = useMemo(
    () =>
      (data?.search?.products?.edges ?? []).map(({ node }) =>
        mapProductToCard(node, palette)
      ),
    [data, palette]
  )

  // A navegação avança de 1 em 1, mas o carrossel já abre com `visibleItems`
  // à mostra — então as posições reais são itens − visíveis + 1.
  const positionCount = Math.max(products.length - visibleItems + 1, 1)

  const [uncontrolledActiveIndex, setUncontrolledActiveIndex] = useState(0)
  const isControlled = controlledActiveIndex !== undefined
  const activeIndex = isControlled
    ? controlledActiveIndex
    : uncontrolledActiveIndex

  const handleActiveIndexChange = useCallback(
    (index: number) => {
      if (!isControlled) {
        setUncontrolledActiveIndex(index)
      }

      onActiveIndexChange?.(index)
    },
    [isControlled, onActiveIndexChange]
  )

  useEffect(() => {
    onItemsChange?.({ positionCount, isLoading })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionCount, isLoading])

  return {
    products,
    isLoading,
    positionCount,
    activeIndex,
    onActiveIndexChange: handleActiveIndexChange,
  }
}
