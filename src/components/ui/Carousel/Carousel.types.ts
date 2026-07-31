import type { ReactNode, Ref } from 'react'

export type CarouselOrientation = 'horizontal' | 'vertical'

export interface CarouselProps<T> {
  items: T[]
  getItemKey: (item: T, index: number) => string
  renderItem: (item: T, index: number) => ReactNode
  className?: string
  /** Eixo do carrossel: 'horizontal' (padrão) ou 'vertical'. */
  orientation?: CarouselOrientation
  /** Índice ativo controlado externamente — se omitido, o carrossel controla o próprio estado. */
  activeIndex?: number
  /** Disparado quando o índice ativo muda (arrasto/swipe). */
  onActiveIndexChange?: (index: number) => void
  /** Arrasto/swipe dá a volta (último → primeiro e vice-versa) em vez de travar na ponta. */
  loop?: boolean
  /** Ref para o container scrollável — usado por quem consome o carrossel para medir overflow (ex.: `CarouselArrows`). */
  containerRef?: Ref<HTMLElement>
  /** Tag do container e dos itens: 'div' (padrão) ou 'ul' (item vira `li`) para preservar semântica de lista. */
  as?: 'div' | 'ul'
}
