export interface CategoryQuickNavigationLink {
  type: 'category' | 'link'
  /**
   * Slug da categoria (quando a página atual é um departamento) ou da
   * subcategoria (quando a página atual é uma categoria) para a qual o
   * filtro deve apontar — concatenado ao path da página atual.
   * Usado quando `type` é `"category"`.
   */
  categorySlug?: string
  /**
   * Link direto e completo para qualquer página do site (ex.: uma página
   * fora da árvore de categorias, como um simulador).
   * Usado quando `type` é `"link"`.
   */
  href?: string
}

export interface CategoryQuickNavigationItem {
  /** Texto exibido abaixo da imagem */
  title: string
  /** Imagem da categoria/subcategoria ou do destino do link */
  image: {
    src: string
    alt?: string
  }
  /** Destino do item: categoria/subcategoria filtrada ou link direto */
  link: CategoryQuickNavigationLink
}

/** Controle de exibição das setas laterais por dispositivo. */
export interface CategoryQuickNavigationArrows {
  /** Exibe as setas laterais no desktop/tablet. */
  desktop?: boolean
  /** Exibe as setas laterais no mobile. */
  mobile?: boolean
}

export interface CategoryQuickNavigationProps {
  /** Título exibido acima dos botões, ex.: "Navegue por categorias" */
  title?: string
  /** Categorias, subcategorias ou links exibidos como navegação rápida */
  items?: CategoryQuickNavigationItem[]
  /** Exibe ou oculta as setas laterais do carrossel, por dispositivo. */
  showArrows?: CategoryQuickNavigationArrows
}
