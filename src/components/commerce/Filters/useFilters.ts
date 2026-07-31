import { setFacet, toggleFacet, useSearch } from '@faststore/sdk'
import { isPLP, usePLP } from '@faststore/core'
import type { Filter_FacetsFragment } from '@generated/graphql'
import { useCallback, useMemo } from 'react'

import { useCachedFacets } from '../../../hooks/useCachedFacets'
import {
  PRICE_FACET_KEY,
  formatRange,
  isFullRange,
  parseRange,
  type SelectedPriceRange,
} from './PriceRangeFacet/priceRange'
import { usePriceClamp } from './usePriceClamp'

interface UseFiltersParams {
  /** Labels de facet (case-insensitive) que podem aparecer nos filtros de especificação */
  allowedFacets?: string[]
}

export function useFilters({ allowedFacets = [] }: UseFiltersParams) {
  const context = usePLP()
  const { state, setState, resetInfiniteScroll } = useSearch()

  const data = isPLP(context) ? context.data : undefined
  const search = data?.search

  // As facets só existem na query client-side (ClientProductGalleryQuery); as
  // queries de servidor não trazem `facets`. A cada toggle, o SWR troca de
  // chave e `pageProductGalleryData` some por um instante — nesse meio-tempo
  // `data.search` vem só do merge do servidor e fica SEM `facets`. Por isso o
  // cache (useCachedFacets) só atualiza quando a resposta realmente traz
  // facets resolvidas, mantendo a última lista enquanto isso.
  const resolvedFacets = search?.facets
  const allFacets = useCachedFacets(resolvedFacets)

  const allowedFacetsSet = useMemo(
    () =>
      new Set(allowedFacets.map((label) => label.trim().toLocaleLowerCase())),
    [allowedFacets]
  )

  // Lista vazia = sem recorte: exibe todas as facetas booleanas que a busca
  // devolver. Quais existem é decisão do cadastro da faceta no admin da VTEX.
  const facets = useMemo(
    () =>
      allFacets.filter(
        (
          facet
        ): facet is Extract<
          Filter_FacetsFragment,
          { __typename: 'StoreFacetBoolean' }
        > =>
          facet.__typename === 'StoreFacetBoolean' &&
          (allowedFacetsSet.size === 0 ||
            allowedFacetsSet.has(facet.label.trim().toLocaleLowerCase()))
      ),
    [allFacets, allowedFacetsSet]
  )

  // A key TEM que ser `price`: o `transformSelectedFacet` da API só converte o
  // encoding "min-to-max" → "min:max" para essa key. Outro range facet (peso,
  // dimensão) iria pro attributePath da IS com o valor cru e não filtraria nada.
  // Descobrimos case-insensitive, mas escrevemos o literal (ver PRICE_FACET_KEY).
  const rangeFacet = useMemo(
    () =>
      allFacets.find(
        (
          facet
        ): facet is Extract<
          Filter_FacetsFragment,
          { __typename: 'StoreFacetRange' }
        > =>
          facet.__typename === 'StoreFacetRange' &&
          facet.key.toLowerCase() === PRICE_FACET_KEY
      ),
    [allFacets]
  )

  // A faixa selecionada vive nos `selectedFacets` — mesma fonte de verdade da URL
  // e da query. Não usamos o `min.selected`/`max.selected` que a API devolve por
  // dois motivos: ele é um eco da REQUEST (com fallback pro absoluto, então "sem
  // filtro" fica indistinguível de "faixa cheia selecionada") e vem um
  // round-trip atrasado durante o re-key do SWR, o que faria o slider pular de
  // volta pro valor antigo a cada arraste.
  const selectedPriceRange = useMemo(() => {
    const value = state.selectedFacets.find(
      (facet) => facet.key === PRICE_FACET_KEY
    )?.value

    return value ? parseRange(value) : null
  }, [state.selectedFacets])

  const { scheduleClamp } = usePriceClamp({ resolvedFacets })

  // NÃO reseta a paginação incremental ao alternar um facet: com
  // `experimental.scrollRestoration` ligado, as páginas já carregadas devem
  // permanecer ao aplicar/remover filtro (as páginas montadas re-buscam com o
  // novo facet). Um `resetInfiniteScroll(0)` aqui zeraria tudo de volta pra 1
  // página — foi o que impedia a permanência de funcionar.
  //
  // O `scheduleClamp` é pass-through quando não há preço selecionado. Havendo,
  // ele remove a facet de preço desta passada e reagenda o aparo (fase 1/2 do
  // usePriceClamp) — nesse caso a paginação acaba resetando na fase 2.
  const handleToggleValue = useCallback(
    (key: string, value: string) => {
      const toggled = toggleFacet(state.selectedFacets, { key, value })

      setState({
        ...state,
        page: 0,
        selectedFacets: scheduleClamp(toggled, selectedPriceRange),
      })
    },
    [setState, state, scheduleClamp, selectedPriceRange]
  )

  // Preço é facet server-side: entra nos `selectedFacets` e a própria busca
  // filtra/pagina/conta. Voltar pra faixa cheia REMOVE a facet em vez de mandar o
  // intervalo inteiro — mandá-lo sujaria a URL e faria a IS reprocessar sem
  // necessidade. Removemos com `.filter()`, não com o `removeFacet` do SDK: aquele
  // casa só por VALUE (ignora a key) e LANÇA se não encontrar.
  const handleRangeChange = useCallback(
    (range: SelectedPriceRange) => {
      if (!rangeFacet) {
        return
      }

      const absolute = {
        min: rangeFacet.min.absolute,
        max: rangeFacet.max.absolute,
      }

      const selectedFacets = isFullRange(range, absolute)
        ? state.selectedFacets.filter((facet) => facet.key !== PRICE_FACET_KEY)
        : setFacet(
            state.selectedFacets,
            {
              key: PRICE_FACET_KEY,
              value: formatRange(range.min, range.max),
            },
            // `unique` substitui NA POSIÇÃO em vez de acumular. Preservar a ordem
            // do array importa: o usePageProductsQuery cacheia as páginas em
            // JSON.stringify(variables), e reordenar invalidaria todas.
            true
          )

      // Reseta a paginação, diferente do toggle booleano. O preço corta o
      // conjunto agressivamente (ex.: 22 → 10 produtos); com as páginas 2 e 3
      // montadas, elas buscariam offsets 12 e 24 num conjunto de 10 e ficariam
      // permanentemente vazias — sem "Carregar mais" pra escapar, já que o total
      // novo não gera próxima página. O `page: 0` acompanha pra a URL não ficar
      // com um `page` velho.
      setState({ ...state, page: 0, selectedFacets })
      resetInfiniteScroll(0)
    },
    [rangeFacet, state, setState, resetInfiniteScroll]
  )

  // Limpa apenas os filtros selecionados pelo usuário: os de ESPECIFICAÇÃO mais a
  // faixa de preço. Usado pelo botão "Limpar filtros" do drawer mobile. Com o
  // preço sendo facet, é tudo o mesmo caminho — um `.filter()` por key.
  //
  // Importante: NÃO zerar `selectedFacets` inteiro. Numa PLP de categoria esse
  // array carrega também as facets estruturais que ancoram a busca — a própria
  // categoria (`collection.meta.selectedFacets`, ex. `category-1`), além de
  // `fuzzy`/`operator`. Apagar tudo desancorava a PLP e fazia a busca cair pra
  // loja inteira (1000+ produtos fora da categoria). Removemos só as keys dos
  // facets que este drawer expõe (os permitidos via `allowedFacets`) e o preço.
  const clearableKeys = useMemo(
    () => new Set([...facets.map((facet) => facet.key), PRICE_FACET_KEY]),
    [facets]
  )

  const handleClearAll = useCallback(() => {
    setState({
      ...state,
      page: 0,
      selectedFacets: state.selectedFacets.filter(
        (facet) => !clearableKeys.has(facet.key)
      ),
    })
    // Limpar alarga o conjunto, então as páginas acumuladas deixam de fazer
    // sentido (mesmo raciocínio da troca de ordenação).
    resetInfiniteScroll(0)
  }, [setState, state, clearableKeys, resetInfiniteScroll])

  // Há algum filtro ativo? Conta só os facets limpáveis (especificação + preço) —
  // as facets estruturais (categoria, fuzzy, operator) estão sempre presentes
  // e não devem habilitar o "Limpar filtros" sozinhas.
  const hasActiveFilters = state.selectedFacets.some((facet) =>
    clearableKeys.has(facet.key)
  )

  return {
    facets,
    rangeFacet,
    selectedPriceRange,
    handleToggleValue,
    handleRangeChange,
    handleClearAll,
    hasActiveFilters,
  }
}
