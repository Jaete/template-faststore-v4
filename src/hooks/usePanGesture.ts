import { useCallback, useEffect, useRef } from 'react'

import { on } from '../utils/events'

const TAP_THRESHOLD = 20

interface PanPoint {
  x: number
  y: number
}

export type PanOrientation = 'horizontal' | 'vertical'

export interface UsePanGestureOptions {
  /** Distância máxima (px) para o gesto ainda contar como toque/clique, não arrasto. */
  threshold?: number
  /**
   * Eixo do arrasto. 'horizontal' (padrão): esquerda→`onSwipeLeft`,
   * direita→`onSwipeRight`. 'vertical': cima→`onSwipeLeft` (avança),
   * baixo→`onSwipeRight` (volta) — mesma semântica de "próximo/anterior".
   */
  orientation?: PanOrientation
  /** Disparado quando soltou sem se mover além do threshold. */
  onTap?: () => void
  /** Arrasto terminou apontando para "avançar" (esquerda no horizontal, cima no vertical). */
  onSwipeLeft?: () => void
  /** Arrasto terminou apontando para "voltar" (direita no horizontal, baixo no vertical). */
  onSwipeRight?: () => void
}

function getPoint(event: MouseEvent | TouchEvent): PanPoint | null {
  if ('touches' in event) {
    const touch = event.touches[0] ?? event.changedTouches[0]

    return touch ? { x: touch.clientX, y: touch.clientY } : null
  }

  return { x: event.clientX, y: event.clientY }
}

/**
 * Hook genérico de gestual de pan (mouse + touch), unificando os dois em um
 * só fluxo: pressionou → registra posição; soltou → compara com a posição
 * inicial e classifica como toque (`onTap`) ou arrasto horizontal
 * (`onSwipeLeft`/`onSwipeRight`). Um `onTap`/arrasto seguinte com clique no
 * mesmo elemento é suprimido, senão um arrasto vira navegação indesejada em
 * cards que são `<a>`.
 *
 * Devolve o `ref` a ser colocado no elemento que recebe o gesto.
 */
export function usePanGesture<T extends HTMLElement>({
  threshold = TAP_THRESHOLD,
  orientation = 'horizontal',
  onTap,
  onSwipeLeft,
  onSwipeRight,
}: UsePanGestureOptions = {}) {
  const ref = useRef<T>(null)
  const startRef = useRef<PanPoint | null>(null)
  const suppressClickRef = useRef(false)

  const handleStart = useCallback((event: MouseEvent | TouchEvent) => {
    startRef.current = getPoint(event)
  }, [])

  const handleEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const start = startRef.current

      startRef.current = null

      if (!start) {
        return
      }

      const end = getPoint(event)

      if (!end) {
        return
      }

      const deltaX = end.x - start.x
      const deltaY = end.y - start.y

      if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
        onTap?.()
        return
      }

      // Eixo principal (o que navega) e secundário conforme a orientação.
      const isVertical = orientation === 'vertical'
      const main = isVertical ? deltaY : deltaX
      const cross = isVertical ? deltaX : deltaY

      // Arrasto predominantemente no eixo secundário não navega (ex.: scroll).
      if (Math.abs(main) <= Math.abs(cross)) {
        return
      }

      suppressClickRef.current = true

      // Negativo no eixo principal (esquerda/cima) = avançar → onSwipeLeft.
      if (main < 0) {
        onSwipeLeft?.()
      } else {
        onSwipeRight?.()
      }
    },
    [threshold, orientation, onTap, onSwipeLeft, onSwipeRight]
  )

  const handleClick = useCallback((event: MouseEvent) => {
    if (!suppressClickRef.current) {
      return
    }

    suppressClickRef.current = false
    event.preventDefault()
    event.stopPropagation()
  }, [])

  // No desktop, arrastar sobre um `<a>`/`<img>` dispara o drag-and-drop
  // nativo do navegador, que engole o `mouseup` e mata o gesto. Bloquear o
  // `dragstart` mantém o pan funcionando em qualquer ponto do elemento.
  const handleDragStart = useCallback((event: DragEvent) => {
    event.preventDefault()
  }, [])

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const offMouseDown = on(node, 'mousedown', handleStart)
    const offMouseUp = on(window, 'mouseup', handleEnd)
    const offTouchStart = on(node, 'touchstart', handleStart, {
      passive: true,
    })
    const offTouchEnd = on(node, 'touchend', handleEnd)
    const offClick = on(node, 'click', handleClick)
    const offDragStart = on(node, 'dragstart', handleDragStart)

    return () => {
      offMouseDown()
      offMouseUp()
      offTouchStart()
      offTouchEnd()
      offClick()
      offDragStart()
    }
  }, [handleStart, handleEnd, handleClick, handleDragStart])

  return ref
}
