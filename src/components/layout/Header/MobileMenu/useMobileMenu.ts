import { useCallback, useEffect, useRef, useState } from 'react'

import type { NavigationNode } from '../Header.types'
import type { MenuLevel } from './MobileMenu.types'

// Espelha a duração do slide-in do painel (MobileMenu.module.scss) — o pop só
// remove o nível da pilha depois que a animação de saída termina
const CLOSE_ANIMATION_DURATION = 200

/**
 * Pilha de níveis do drill-down do menu mobile.
 *
 * Cada `push` sobrepõe um painel com os filhos do nó tocado. `pop` anima o
 * painel do topo para fora (mesma duração do slide-in) e só então o remove da
 * pilha, revelando o nível de baixo. `reset` limpa tudo instantaneamente
 * (chamado no fechamento do drawer inteiro, após a animação dele, para o
 * menu reabrir sempre na raiz sem flicker visual).
 */
export function useMobileMenu() {
  const [stack, setStack] = useState<MenuLevel[]>([])
  const [isClosingTop, setIsClosingTop] = useState(false)
  const timeoutRef = useRef<number>()

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  const push = useCallback(
    (label: string, href: string, items: NavigationNode[]) => {
      setStack((prev) => [...prev, { label, href, items }])
    },
    []
  )

  const pop = useCallback(() => {
    setIsClosingTop((alreadyClosing) => {
      if (alreadyClosing) {
        return alreadyClosing
      }

      timeoutRef.current = window.setTimeout(() => {
        setStack((prev) => prev.slice(0, -1))
        setIsClosingTop(false)
      }, CLOSE_ANIMATION_DURATION)

      return true
    })
  }, [])

  const reset = useCallback(() => {
    window.clearTimeout(timeoutRef.current)
    setStack([])
    setIsClosingTop(false)
  }, [])

  return { stack, isClosingTop, push, pop, reset }
}
