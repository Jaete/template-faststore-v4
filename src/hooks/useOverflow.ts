import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/**
 * Detecta se o conteúdo de `ref` transborda sua caixa no eixo indicado
 * (scroll{Width,Height} > client{Width,Height}) — usado para só exibir setas
 * de navegação quando o carrossel realmente tem itens fora da área visível.
 */
export function useOverflow<T extends HTMLElement>(
  ref: RefObject<T>,
  deps: unknown[] = [],
  orientation: 'horizontal' | 'vertical' = 'horizontal'
) {
  const [hasOverflow, setHasOverflow] = useState(false)

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const checkOverflow = () => {
      const overflow =
        orientation === 'vertical'
          ? node.scrollHeight > node.clientHeight + 1
          : node.scrollWidth > node.clientWidth + 1

      setHasOverflow(overflow)
    }

    checkOverflow()

    const observer = new ResizeObserver(checkOverflow)
    observer.observe(node)

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, orientation, ...deps])

  return hasOverflow
}
