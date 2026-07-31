/**
 * Controle de exibição das setas laterais por dispositivo. No mobile o
 * carrossel dá lugar a um dropdown (sem setas), então só o `desktop` tem efeito.
 */
export interface ModelQuickFilterArrows {
  /** Exibe as setas laterais no desktop/tablet. */
  desktop?: boolean
}

export interface ModelQuickFilterProps {
  /** Exibe ou oculta a seção inteira. */
  show?: boolean
  /** Título acima dos botões, ex.: "Busque por marca". */
  title?: string
  /**
   * Chave da faceta cujos valores viram os chips (ex.: `brand`, `category-1`).
   * Sem ela — ou quando a categoria atual não expõe essa faceta — a seção não
   * renderiza.
   */
  facetKey?: string
  /** Texto da opção que limpa a seleção, no dropdown mobile. */
  clearOptionLabel?: string
  /** Placeholder do dropdown mobile quando nada está selecionado. */
  placeholder?: string
  /** Exibe ou oculta as setas laterais do carrossel (desktop). */
  showArrows?: ModelQuickFilterArrows
}

/** Item já normalizado (valor de faceta) pronto pra render. */
export interface ModelQuickFilterChip {
  label: string
  /** Facet key a aplicar ao grid (ex.: 'brand', 'category-1'). */
  key: string
  /** Facet value a aplicar. */
  value: string
  /** Se o facet já está ativo no estado de busca atual. */
  selected: boolean
}
