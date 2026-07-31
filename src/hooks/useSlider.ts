import { useCallback, useState } from 'react'

import { usePanGesture } from './usePanGesture'
import type { PanOrientation } from './usePanGesture'

export interface UseSliderOptions {
  /** Quantidade de itens do slider — o índice ativo nunca passa disso. */
  itemCount: number
  /** Distância mínima (px) do arrasto para contar como troca de item. */
  threshold?: number
  /** Eixo do arrasto: 'horizontal' (padrão) ou 'vertical'. */
  orientation?: PanOrientation
  /** Índice ativo controlado externamente — se omitido, o hook controla o próprio estado. */
  activeIndex?: number
  /** Disparado a cada troca de índice (arrasto ou chamada de `next`/`prev`/`setActiveIndex`). */
  onActiveIndexChange?: (index: number) => void
  /** `next`/`prev` dão a volta (último → primeiro e vice-versa) em vez de travar na ponta. */
  loop?: boolean
}

/**
 * Slider genérico por índice: arrastar (mouse ou touch) para a esquerda
 * avança, para a direita volta. Constrói em cima de `usePanGesture` — só
 * cuida da navegação por índice; a UI (scroll, transform, etc.) fica a
 * cargo de quem consome o hook, reagindo a `activeIndex`.
 *
 * Aceita `activeIndex`/`onActiveIndexChange` opcionais para uso controlado
 * (ex.: setas e dots externos ao componente que consome o hook).
 */
export function useSlider<T extends HTMLElement>({
  itemCount,
  threshold,
  orientation = 'horizontal',
  activeIndex: controlledIndex,
  onActiveIndexChange,
  loop = false,
}: UseSliderOptions) {
  const [internalIndex, setInternalIndex] = useState(0)
  const isControlled = controlledIndex !== undefined
  const activeIndex = isControlled ? controlledIndex : internalIndex
  const lastIndex = Math.max(itemCount - 1, 0)

  const setActiveIndex = useCallback(
    (updater: number | ((index: number) => number)) => {
      const resolved =
        typeof updater === 'function' ? updater(activeIndex) : updater

      if (!isControlled) {
        setInternalIndex(resolved)
      }

      onActiveIndexChange?.(resolved)
    },
    [activeIndex, isControlled, onActiveIndexChange]
  )

  const next = useCallback(() => {
    setActiveIndex((index) => {
      if (index < lastIndex) {
        return index + 1
      }

      return loop ? 0 : lastIndex
    })
  }, [lastIndex, loop, setActiveIndex])

  const prev = useCallback(() => {
    setActiveIndex((index) => {
      if (index > 0) {
        return index - 1
      }

      return loop ? lastIndex : 0
    })
  }, [lastIndex, loop, setActiveIndex])

  const ref = usePanGesture<T>({
    threshold,
    orientation,
    onSwipeLeft: next,
    onSwipeRight: prev,
  })

  return { ref, activeIndex, setActiveIndex, next, prev }
}
