import { setFacet, useSearch } from '@faststore/sdk'
import type { Filter_FacetsFragment } from '@generated/graphql'
import { useCallback, useEffect, useRef } from 'react'

import {
  PRICE_FACET_KEY,
  clampRange,
  formatRange,
  type SelectedPriceRange,
} from './PriceRangeFacet/priceRange'

interface Facet {
  key: string
  value: string
}

interface PendingClamp {
  /** Faixa que o usuário pediu, à espera de um `absolute` novo pra ser aparada. */
  intent: SelectedPriceRange
  /** Assinatura das facets NÃO-preço no momento em que o clamp foi agendado. */
  signature: string
}

/**
 * Assinatura das facets ignorando o preço. Serve de token de geração: o clamp só
 * pode usar um `absolute` que tenha sido calculado sob ESTA combinação de facets.
 */
function signFacets(facets: Facet[]) {
  return facets
    .filter((facet) => facet.key !== PRICE_FACET_KEY)
    .map((facet) => `${facet.key}=${facet.value}`)
    .sort()
    .join('&')
}

function findPriceFacet(facets: Filter_FacetsFragment[] | undefined) {
  return facets?.find(
    (
      facet
    ): facet is Extract<
      Filter_FacetsFragment,
      { __typename: 'StoreFacetRange' }
    > =>
      facet.__typename === 'StoreFacetRange' &&
      facet.key.toLowerCase() === PRICE_FACET_KEY
  )
}

interface UsePriceClampParams {
  /**
   * Facets COMO VIERAM da resposta — nunca a lista cacheada (useCachedFacets).
   * O cache serve valores stale de propósito, e aparar contra um `absolute`
   * antigo produziria o valor errado.
   */
  resolvedFacets: Filter_FacetsFragment[] | undefined
}

/**
 * Aparo da faixa de preço quando uma facet booleana encolhe o range absoluto.
 *
 * Não dá pra fazer isso reativo de forma ingênua ("um efeito vê o `absolute` novo
 * e corrige"), por três motivos:
 *
 * 1. STALENESS — durante o re-key do SWR, as facets resolvidas somem por um
 *    instante e o cache serve o `absolute` ANTERIOR. Aparar ali dá valor errado,
 *    seguido de um segundo aparo quando o dado real chega: duas escritas de URL,
 *    dois round-trips, slider tremendo.
 * 2. TARDE DEMAIS — quando o efeito rodasse, a request ruim já foi. Se a
 *    combinação zera o resultado, a IS devolve `facets: []`: não há `rangeFacet`
 *    pra aparar contra, e a lista de filtros já teria sumido.
 * 3. LOOP — escrever o preço muda a key do SWR, que traz facets novas, que
 *    re-disparam o efeito.
 *
 * Então o aparo é PREEMPTIVO, em duas fases:
 *
 * - Fase 1 (síncrona, no toggle): aplica o toggle e REMOVE a facet de preço desta
 *   passada. Assim a resposta nunca zera por preço, `facets` nunca vem vazia, e o
 *   `absolute` novo (não estreitado por preço) sempre chega. Guarda a intenção.
 * - Fase 2 (reativa, quando as facets frescas chegam): apara contra o `absolute`
 *   fresco e reescreve a facet, consumindo a intenção.
 *
 * O custo é um round-trip extra por toggle enquanto há preço ativo — aceito para
 * manter `selectedFacets`/URL/slider como fonte de verdade única.
 */
export function usePriceClamp({ resolvedFacets }: UsePriceClampParams) {
  const { state, setState, resetInfiniteScroll } = useSearch()

  // Bookkeeping entre as duas fases. Ref e não state: nada renderiza a partir
  // disto, e é escrito num event handler (fase 1) e lido/limpo no efeito (fase
  // 2) — nunca durante o render.
  const pendingRef = useRef<PendingClamp | null>(null)

  const scheduleClamp = useCallback(
    (nextFacets: Facet[], intent: SelectedPriceRange | null) => {
      // Sem faixa selecionada não há nada pra aparar: pass-through, mesmo
      // comportamento de quem nunca mexeu no preço.
      if (!intent) {
        return nextFacets
      }

      const withoutPrice = nextFacets.filter(
        (facet) => facet.key !== PRICE_FACET_KEY
      )

      pendingRef.current = { intent, signature: signFacets(withoutPrice) }

      return withoutPrice
    },
    []
  )

  useEffect(() => {
    const pending = pendingRef.current

    if (!pending) {
      return
    }

    const rangeFacet = findPriceFacet(resolvedFacets)

    // Espera as facets frescas: sem `rangeFacet` (re-key em andamento) ou com
    // assinatura de outra combinação, este `absolute` não serve pra aparar.
    if (!rangeFacet) {
      return
    }

    if (signFacets(state.selectedFacets) !== pending.signature) {
      return
    }

    const absolute = {
      min: rangeFacet.min.absolute,
      max: rangeFacet.max.absolute,
    }
    const clamped = clampRange(pending.intent, absolute)

    // Consome a intenção antes de escrever: o `setState` abaixo re-dispara este
    // efeito (o `state` está nas dependências), e é o curto-circuito no topo com
    // o ref já limpo que impede a reescrita em loop.
    pendingRef.current = null

    // Reescreve o preço SEMPRE, mesmo quando o aparo não mudou nada: a fase 1
    // removeu a facet pra garantir um `absolute` limpo, então sem este passo todo
    // toggle booleano limparia silenciosamente o filtro de preço do usuário.
    setState({
      ...state,
      page: 0,
      selectedFacets: setFacet(
        state.selectedFacets,
        {
          key: PRICE_FACET_KEY,
          value: formatRange(clamped.min, clamped.max),
        },
        true
      ),
    })

    // A fase 1 alargou (tirou o preço) e esta fase re-estreita, então as páginas
    // acumuladas podem apontar pra offsets fora do novo conjunto — mesmo motivo
    // do reset em handleRangeChange.
    resetInfiniteScroll(0)
  }, [resolvedFacets, state, setState, resetInfiniteScroll])

  return { scheduleClamp }
}
