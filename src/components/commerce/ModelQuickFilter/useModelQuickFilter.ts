import { toggleFacet, useSearch } from '@faststore/sdk'
import { isPLP, usePLP } from '@faststore/core'
import type { Filter_FacetsFragment } from '@generated/graphql'
import { useCallback, useMemo } from 'react'

import { useCachedFacets } from '../../../hooks/useCachedFacets'
import type { ModelQuickFilterChip } from './ModelQuickFilter.types'

interface UseModelQuickFilterParams {
  /** Chave da faceta cujos valores viram chips (ex.: 'brand', 'category-1'). */
  facetKey?: string
}

export function useModelQuickFilter({ facetKey }: UseModelQuickFilterParams) {
  const context = usePLP()
  const { state, setState } = useSearch()

  const data = isPLP(context) ? context.data : undefined
  const resolvedFacets = data?.search?.facets
  const cachedFacets = useCachedFacets(resolvedFacets)

  const selectedFacetSet = useMemo(
    () =>
      new Set(
        state.selectedFacets.map((facet) => `${facet.key}:${facet.value}`)
      ),
    [state.selectedFacets]
  )

  const isFacetSelected = useCallback(
    (key: string, value: string) => selectedFacetSet.has(`${key}:${value}`),
    [selectedFacetSet]
  )

  // Os chips são os valores da faceta escolhida no CMS, na ordem em que a
  // busca os devolve. Quais facetas existem — e quais aparecem — é decisão do
  // cadastro da faceta no admin da VTEX, não deste componente.
  const chips = useMemo<ModelQuickFilterChip[]>(() => {
    if (!facetKey) {
      return []
    }

    const facet = cachedFacets.find(
      (
        candidate
      ): candidate is Extract<
        Filter_FacetsFragment,
        { __typename: 'StoreFacetBoolean' }
      > =>
        candidate.__typename === 'StoreFacetBoolean' &&
        candidate.key === facetKey
    )

    return (facet?.values ?? []).map((entry) => ({
      label: entry.label,
      key: facetKey,
      value: entry.value,
      selected: isFacetSelected(facetKey, entry.value),
    }))
  }, [facetKey, cachedFacets, isFacetSelected])

  // Toggle na mesma página: alterna o facet no estado compartilhado do
  // SearchProvider — o grid re-filtra e a URL atualiza. Mesmo padrão do
  // useFilters (não reseta a paginação incremental).
  const onToggle = useCallback(
    (key: string, value: string) => {
      setState({
        ...state,
        selectedFacets: toggleFacet(state.selectedFacets, { key, value }),
      })
    },
    [setState, state]
  )

  // Chip atualmente ativo (o primeiro selecionado, se houver) — alimenta o
  // valor exibido no dropdown mobile.
  const selectedChip = useMemo(
    () => chips.find((chip) => chip.selected) ?? null,
    [chips]
  )

  // Set dos facets representados pelos chips atuais — computado uma vez e
  // reutilizado por onSelectExclusive/onClear, em vez de reconstruído a cada
  // clique do usuário.
  const chipFacetSet = useMemo(
    () => new Set(chips.map((chip) => `${chip.key}:${chip.value}`)),
    [chips]
  )

  // Seleção exclusiva (usada pelo dropdown mobile): aplica só o facet escolhido
  // e remove qualquer outro chip do grupo que estivesse ativo — o dropdown é
  // seleção única, então dois modelos ativos ao mesmo tempo não fazem sentido.
  // Facets fora do quick filter (ex.: filtros da coluna lateral) são preservados.
  const onSelectExclusive = useCallback(
    (key: string, value: string) => {
      const withoutChips = state.selectedFacets.filter(
        (facet) => !chipFacetSet.has(`${facet.key}:${facet.value}`)
      )

      setState({
        ...state,
        selectedFacets: [...withoutChips, { key, value }],
      })
    },
    [chipFacetSet, setState, state]
  )

  // Limpa a seleção do quick filter: remove os facets de TODOS os chips e volta
  // ao estado sem nada selecionado. Preserva facets de fora do quick filter
  // (ex.: filtros da coluna lateral). Usado pela opção de reset do dropdown.
  const onClear = useCallback(() => {
    setState({
      ...state,
      selectedFacets: state.selectedFacets.filter(
        (facet) => !chipFacetSet.has(`${facet.key}:${facet.value}`)
      ),
    })
  }, [chipFacetSet, setState, state])

  return { chips, onToggle, selectedChip, onSelectExclusive, onClear }
}
