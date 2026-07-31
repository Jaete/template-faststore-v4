import { isPDP, isPLP, usePage } from '@faststore/core'
import type { PDPContext, PLPContext } from '@faststore/core'

import type { BreadcrumbItem } from './Breadcrumb.types'

interface UseBreadcrumbParams {
  items?: BreadcrumbItem[]
}

export function useBreadcrumb({ items }: UseBreadcrumbParams) {
  const context = usePage<PDPContext | PLPContext>()

  if (items && items.length > 0) {
    return { breadcrumbList: items }
  }

  if (isPDP(context)) {
    return {
      breadcrumbList:
        context.data?.product?.breadcrumbList?.itemListElement ?? [],
    }
  }

  if (isPLP(context)) {
    return {
      breadcrumbList:
        context.data?.collection?.breadcrumbList?.itemListElement ?? [],
    }
  }

  return { breadcrumbList: [] }
}
