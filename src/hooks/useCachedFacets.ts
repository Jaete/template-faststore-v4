import { useState } from 'react'
import type { Filter_FacetsFragment } from '@generated/graphql'

/**
 * As facets só voltam da query client-side (ClientProductGalleryQuery); entre
 * re-keys do SWR, `data.search` some das facets por um instante. Este hook
 * guarda a última lista resolvida para a UI (filtros, quick filter) não
 * piscar/vazar enquanto o SWR troca de chave.
 *
 * `resolvedFacets` troca de identidade a cada render do SWR (deepmerge), então
 * não dá pra keyar um useEffect nele sem disparar a cada render. Em vez disso,
 * usamos o padrão oficial do React de "ajustar state durante o render":
 * comparamos com o valor já guardado e só chamamos o setter quando o conteúdo
 * realmente mudou — React descarta o render em andamento e re-renderiza antes
 * de tocar o DOM, sem passar por commit nem useEffect.
 *
 * Também ignoramos listas VAZIAS. Verificado na conta: quando a combinação de
 * filtros zera o resultado, a Intelligent Search devolve `facets: []` (não uma
 * lista com contagens zeradas). Aceitar isso apagaria o cache, o <Filters>
 * retornaria `null` e a lista de filtros inteira desapareceria — sem como o
 * usuário desfazer o filtro que o levou até ali. Segurando a última lista
 * conhecida, os filtros continuam operáveis.
 */
export function useCachedFacets(
  resolvedFacets: Filter_FacetsFragment[] | undefined
): Filter_FacetsFragment[] {
  const [cachedFacets, setCachedFacets] = useState<Filter_FacetsFragment[]>(
    () => resolvedFacets ?? []
  )

  if (resolvedFacets?.length && resolvedFacets !== cachedFacets) {
    setCachedFacets(resolvedFacets)
  }

  return cachedFacets
}
