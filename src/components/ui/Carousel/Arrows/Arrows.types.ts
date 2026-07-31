import type { RefObject } from 'react'

export type ArrowsVariant = 'circle' | 'plain'

export type ArrowsOrientation = 'horizontal' | 'vertical'

export interface ArrowsProps {
  /** Ref do container scrollável do carrossel (para medir overflow). */
  containerRef: RefObject<HTMLElement>
  /** Eixo em que se mede o overflow: 'horizontal' (padrão) ou 'vertical'. */
  orientation?: ArrowsOrientation
  /** Índice ativo — mesmo estado controlado passado ao `Carousel`. */
  activeIndex: number
  itemCount: number
  onActiveIndexChange: (index: number) => void
  /** Dá a volta (último → primeiro e vice-versa) em vez de travar na ponta. */
  loop?: boolean
  /**
   * 'circle' (padrão): botão circular, some quando não dá pra navegar naquela
   * direção. 'plain': sem círculo (só o ícone), sempre visível — fica com
   * estado `disabled` quando não dá pra navegar.
   */
  variant?: ArrowsVariant
  /** Renderiza só uma das setas — útil quando elas ficam em pontos distintos do layout. */
  only?: 'previous' | 'next'
  className?: string
}
