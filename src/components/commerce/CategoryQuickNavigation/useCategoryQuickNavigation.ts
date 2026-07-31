import { isPLP, usePage } from '@faststore/core'
import type { PLPContext } from '@faststore/core'

import type { CategoryQuickNavigationItem } from './CategoryQuickNavigation.types'

interface UseCategoryQuickNavigationParams {
  items?: CategoryQuickNavigationItem[]
}

function buildHref(currentPath: string, categorySlug: string) {
  return `${currentPath.replace(/\/$/, '')}/${categorySlug.replace(/^\//, '')}`
}

export function useCategoryQuickNavigation({
  items,
}: UseCategoryQuickNavigationParams) {
  const context = usePage<PLPContext>()

  if (!items?.length) {
    return { navigationItems: [] }
  }

  const currentPath = isPLP(context)
    ? context.data?.collection?.breadcrumbList?.itemListElement?.slice(-1)[0]
        ?.item
    : undefined

  const navigationItems = items.flatMap((item) => {
    if (item.link.type === 'link' && item.link.href) {
      return [{ ...item, href: item.link.href }]
    }

    if (
      item.link.type === 'category' &&
      currentPath &&
      item.link.categorySlug
    ) {
      return [{ ...item, href: buildHref(currentPath, item.link.categorySlug) }]
    }

    return []
  })

  return { navigationItems }
}
