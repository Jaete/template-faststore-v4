export interface FiltersProps {
  /** Labels de facet (case-insensitive) que podem aparecer nos filtros de especificação */
  allowedFacets?: string[]
  /**
   * `default` = coluna de filtros do desktop (com título "Filtros" próprio).
   * `drawer` = dentro do drawer mobile: esconde o título interno (o header do
   * drawer já o mostra) e ativa os ajustes visuais do Figma mobile, escopados
   * a essa variante — o desktop não muda.
   */
  variant?: 'default' | 'drawer'
}
