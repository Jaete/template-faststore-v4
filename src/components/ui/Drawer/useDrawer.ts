import { useCallback, useEffect, useState } from 'react'

import { listen, on } from '../../../utils/events'

// Cobre a maior duração de saída entre overlay e painel (ver Drawer.module.scss)
// — só depois disso o estado volta a "fechado" e as classes de animação saem,
// senão o drawer "pisca" para o estado oculto antes da animação terminar
const CLOSE_ANIMATION_DURATION = 300

interface UseDrawerParams {
  openEventName: string
  closeEventName?: string
  onClose?: () => void
}

export function useDrawer({
  openEventName,
  closeEventName,
  onClose,
}: UseDrawerParams) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(
    () =>
      listen(openEventName, () => {
        setIsClosing(false)
        setIsOpen(true)
      }),
    [openEventName]
  )

  const close = useCallback(() => {
    setIsClosing(true)

    window.setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
      onClose?.()
    }, CLOSE_ANIMATION_DURATION)
  }, [onClose])

  // Só escuta o evento de fechamento enquanto aberto — fechar um drawer
  // fechado dispararia a animação de saída sobre um painel já oculto
  useEffect(() => {
    if (!closeEventName || !isOpen) {
      return
    }

    return listen(closeEventName, close)
  }, [closeEventName, isOpen, close])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const offKeyDown = on(document, 'keydown', (event) => {
      if (event.key === 'Escape') {
        close()
      }
    })

    // Compensa a largura da scrollbar que some ao travar o scroll — sem isso,
    // o conteúdo da página se desloca (layout shift) na abertura/fechamento
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth
    const { overflow, paddingRight } = document.body.style

    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      offKeyDown()
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [isOpen, close])

  return { isOpen, isClosing, close }
}
