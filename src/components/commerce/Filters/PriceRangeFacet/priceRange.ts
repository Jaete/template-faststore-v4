/** Faixa de preço; `null` (nos consumidores) = sem filtro aplicado. */
export interface SelectedPriceRange {
  min: number
  max: number
}

/**
 * Key da facet de preço enviada para a API.
 *
 * Literal de propósito, mesmo quando descobrimos o facet case-insensitive: o
 * `transformSelectedFacet` do @faststore/api tem um `switch` CASE-SENSITIVE em
 * `'price'` — é ele que converte o encoding `min-to-max` para o `min:max` que a
 * Intelligent Search espera no attributePath. Escrever a key como a API devolveu
 * (ex.: `Price`) passaria o valor cru e quebraria o filtro silenciosamente.
 */
export const PRICE_FACET_KEY = 'price'

/**
 * Encoding do valor da facet de preço. Mesmo formato do @faststore/components
 * (FilterFacetRange): a API espera o intervalo como uma única string
 * `min-to-max`, e converte para `min:max` no servidor.
 *
 * O `-to-` (em vez de `:`) também é o que sobrevive à URL: o `formatSearchState`
 * serializa via `URLSearchParams`, que passa `-to-` literal mas escaparia `:`
 * como `%3A`.
 */
export const formatRange = (min: number, max: number) =>
  `${min.toFixed(2)}-to-${max.toFixed(2)}`

/**
 * Lê `400.00-to-900.00` de volta para números. A seleção do usuário vive nos
 * `selectedFacets` (fonte de verdade única, compartilhada com a URL), então
 * precisamos desserializar de lá para alimentar o slider.
 */
export function parseRange(value: string): SelectedPriceRange | null {
  const [min, max] = value.split('-to-').map(Number)

  if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) {
    return null
  }

  return { min, max }
}

/**
 * Aparo UNIDIRECIONAL da seleção do usuário contra o range absoluto recalculado.
 *
 * Só APERTA, nunca alarga: quando outra facet encolhe o range absoluto, a
 * seleção é trazida para dentro dos novos limites; se o absoluto ALARGOU (facet
 * removida), a seleção do usuário é mantida — não há re-expansão, de propósito
 * (não guardamos "intenção original", o usuário reajusta se quiser).
 *
 * Sem sobreposição nenhuma (o aparo inverteria, ex.: seleção 400–900 contra um
 * absoluto 77,90–191,90), colapsa no absoluto inteiro. Nunca mandar intervalo
 * invertido: a IS devolve `facets: []` quando o resultado zera, o que apagaria a
 * lista de filtros (ver useCachedFacets).
 */
export function clampRange(
  selected: SelectedPriceRange,
  absolute: SelectedPriceRange
): SelectedPriceRange {
  const min = Math.max(selected.min, absolute.min)
  const max = Math.min(selected.max, absolute.max)

  return min >= max ? absolute : { min, max }
}

/**
 * A seleção cobre o range absoluto inteiro? Então não é filtro — o chamador deve
 * REMOVER a facet em vez de mandar o intervalo completo.
 *
 * Compara no domínio FORMATADO, não no numérico: o `absolute` vem da API como
 * `77.9` enquanto todo valor que escrevemos passa por `toFixed(2)` (`77.90`).
 * Comparar número a número faria o "voltou pra faixa cheia" nunca casar. Toda
 * comparação nova de faixa deve seguir a mesma regra — é o que garante ponto
 * fixo e evita reescritas em loop.
 */
export const isFullRange = (
  range: SelectedPriceRange,
  absolute: SelectedPriceRange
) =>
  formatRange(range.min, range.max) === formatRange(absolute.min, absolute.max)
