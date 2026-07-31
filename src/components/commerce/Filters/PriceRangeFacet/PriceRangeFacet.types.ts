import type { Filter_FacetsFragment } from '@generated/graphql'

import type { SelectedPriceRange } from './priceRange'

export interface PriceRangeFacetProps {
  /**
   * Facet de preço da VTEX — usado pelos limites `absolute` (mín/máx possíveis
   * no conjunto atual). O `selected` da API é ignorado de propósito: ele é um eco
   * da request, com fallback pro absoluto, então não distingue "sem filtro" de
   * "faixa cheia selecionada" — e vem stale durante o re-key do SWR. A faixa
   * escolhida chega pela prop `selected`, derivada dos `selectedFacets`.
   */
  facet: Extract<Filter_FacetsFragment, { __typename: 'StoreFacetRange' }>
  /** Faixa escolhida pelo usuário; `null` = barra cheia (sem filtro). */
  selected: SelectedPriceRange | null
  onChange: (range: SelectedPriceRange) => void
}
