import { useState } from 'react'

import type { HeaderNavigationItem, NavigationNode } from '../Header.types'

// Com a coluna de departamentos cabem 3 banners; sem ela (painel inteiro), 4
const MAX_BANNERS_WITH_DEPARTMENTS = 3
const MAX_BANNERS_FULL_WIDTH = 4

interface UseMegaMenuParams {
  item: HeaderNavigationItem
}

/** O nó expande conteúdo no hover (nova árvore ou banners)? */
export function hasContent(node: NavigationNode) {
  return Boolean(node.categories?.length || node.banners?.length)
}

/**
 * Estado e derivações do reveal gradual da árvore do mega menu:
 *
 * 1. Sem hover: banners padrão do item (nível 0)
 * 2. Hover no departamento: painel cinza com as categorias dele
 *    (ou os banners dele, quando não há árvore)
 * 3. Hover na categoria: coluna de subcategorias ao lado
 * 4. Hover na subcategoria (último nível): banner único à direita
 */
export function useMegaMenu({ item }: UseMegaMenuParams) {
  const [activeDepartment, setActiveDepartment] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [activeSubcategory, setActiveSubcategory] = useState<number | null>(
    null
  )

  const openDepartment = (index: number) => {
    setActiveDepartment(index)
    setActiveCategory(null)
    setActiveSubcategory(null)
  }

  const openCategory = (index: number) => {
    setActiveCategory(index)
    setActiveSubcategory(null)
  }

  const openSubcategory = (index: number) => {
    setActiveSubcategory(index)
  }

  const departments = item.departments ?? []
  const department =
    activeDepartment !== null ? departments[activeDepartment] : null

  const categories = department?.categories?.length
    ? department.categories
    : null
  const category =
    categories && activeCategory !== null ? categories[activeCategory] : null

  const subcategories = category?.categories?.length
    ? category.categories
    : null
  const subcategory =
    subcategories && activeSubcategory !== null
      ? subcategories[activeSubcategory]
      : null

  // Banner único do nível mais profundo em hover: subcategoria, ou a própria
  // categoria quando ela tem banners em vez de subcategorias
  const revealedBanner =
    subcategory?.banners?.[0] ??
    (subcategories ? null : category?.banners?.[0]) ??
    null

  // Sem árvore no departamento em hover, o painel mostra banners: os do
  // próprio departamento ou, sem departamento ativo, os padrão do item
  const fallbackBanners = department?.banners?.length
    ? department.banners
    : item.banners

  const isFullWidthBanners = departments.length === 0
  const visibleBanners = fallbackBanners?.slice(
    0,
    isFullWidthBanners ? MAX_BANNERS_FULL_WIDTH : MAX_BANNERS_WITH_DEPARTMENTS
  )

  return {
    departments,
    activeDepartment,
    openDepartment,
    activeCategory,
    openCategory,
    activeSubcategory,
    openSubcategory,
    department,
    categories,
    category,
    subcategories,
    subcategory,
    revealedBanner,
    visibleBanners,
    isFullWidthBanners,
  }
}
