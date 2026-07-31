export interface SearchCategory {
  /** Nome da categoria, exibido como título do card. */
  name: string
  imageSrc: string
  imageAlt?: string
  link: {
    /** Texto do link, exibido como subtítulo do card. Sem valor, usa o default "Acesse a categoria". */
    label?: string
    href: string
  }
}

export interface CategoryCarouselProps {
  categories?: SearchCategory[]
}
