import type { AllowedFacetItem } from './ProductGrid.types'

/**
 * O CMS manda os itens como `{ label }` (ver ProductGrid.types); normalizamos
 * pra string[]. Strings puras são aceitas por compatibilidade com conteúdo
 * antigo.
 *
 * Lista vazia significa "sem restrição": quais facetas de especificação
 * aparecem no filtro é decisão do cadastro da faceta no admin da VTEX, e o
 * `allowedFacets` do CMS é só um recorte opcional por cima disso.
 */
export function resolveAllowedFacets(
  allowedFacets: AllowedFacetItem[] | undefined
): string[] {
  return (allowedFacets ?? [])
    .map((item) => (typeof item === 'string' ? item : item?.label))
    .filter((label): label is string => Boolean(label && label.trim()))
}
