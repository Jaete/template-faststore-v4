import { useEffect, useRef, useState } from 'react'

const CLOSE_DELAY_MS = 150

/**
 * Fallback para desmontar o painel caso o `animationend` nunca dispare
 * (ex.: animações desabilitadas no browser). Generosamente maior que a
 * animação de saída — o caminho normal é o evento, não este timer.
 */
const CLOSE_FALLBACK_MS = 400

/**
 * Encapsula o item ativo do mega menu, o grace period de fechamento (que
 * evita o flicker ao mover o mouse do link para o painel) e a fase de
 * closing, que mantém o painel montado durante a animação de saída — o
 * desmonte é disparado pelo `animationend` do painel (via `finishClosing`),
 * então a duração vive só no CSS.
 */
export function useNavigation() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fallbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }

    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current)
      fallbackTimeoutRef.current = null
    }
  }

  // Cancela o fechamento em qualquer fase: o grace period e a animação de
  // saída (re-hover durante o fade reabre o painel no lugar)
  const cancelScheduledClose = () => {
    clearTimers()
    setIsClosing(false)
  }

  const openMenu = (index: number) => {
    cancelScheduledClose()
    setActiveIndex(index)
  }

  // Desmonta o painel — chamado pelo animationend da animação de saída
  // (ou pelo fallback, se o evento não disparar)
  const finishClosing = () => {
    clearTimers()
    setActiveIndex(null)
    setIsClosing(false)
  }

  const startClosing = () => {
    setIsClosing(true)
    fallbackTimeoutRef.current = setTimeout(finishClosing, CLOSE_FALLBACK_MS)
  }

  const scheduleClose = () => {
    cancelScheduledClose()
    closeTimeoutRef.current = setTimeout(() => {
      closeTimeoutRef.current = null
      startClosing()
    }, CLOSE_DELAY_MS)
  }

  const closeMenu = () => {
    cancelScheduledClose()
    startClosing()
  }

  // Cleanup no unmount: só os timers (sem setState em componente desmontado)
  useEffect(() => clearTimers, [])

  return {
    activeIndex,
    isClosing,
    openMenu,
    scheduleClose,
    cancelScheduledClose,
    closeMenu,
    finishClosing,
  }
}
