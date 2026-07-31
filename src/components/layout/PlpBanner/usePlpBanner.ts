import { isPLP, usePage } from '@faststore/core'
import type { PLPContext } from '@faststore/core'

/**
 * Obtém o nome da categoria atual na PLP.
 *
 * Usa o último item do breadcrumb da collection (o mais profundo, que é a
 * categoria/subcategoria em que a página está), com fallback para o
 * `seo.title` da collection. Fora de uma PLP (ou sem dados), retorna
 * `undefined`.
 */
export function useCategoryName(): string | undefined {
  const context = usePage<PLPContext>()

  if (!isPLP(context)) {
    return undefined
  }

  const breadcrumb = context.data?.collection?.breadcrumbList?.itemListElement
  const current = breadcrumb?.[breadcrumb.length - 1]?.name

  return current ?? context.data?.collection?.seo?.title ?? undefined
}
