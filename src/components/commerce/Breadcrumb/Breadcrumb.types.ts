export interface BreadcrumbItem {
  /** Texto exibido do item */
  name: string
  /** URL de destino do item */
  item: string
  position?: number
}

export interface BreadcrumbProps {
  /**
   * Itens definidos manualmente pelo CMS. Quando preenchido, tem prioridade
   * sobre a árvore de categoria do produto (PDP) e a categoria atual (PLP)
   * detectadas automaticamente.
   */
  items?: BreadcrumbItem[]
  /** Texto do link inicial que leva à home */
  homeLabel?: string
  /**
   * Faz o breadcrumb sangrar sobre a section seguinte (ex.: PlpBanner),
   * puxando-a para cima e ficando por cima dela — mesma ideia do
   * "Sobrepor ao banner" do Header
   */
  bleed?: boolean
  /**
   * Inverte as cores, usado para sobreposição em banners escuros
   */
  invertColor?: boolean
}
