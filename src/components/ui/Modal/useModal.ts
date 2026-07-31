import { useCallback, useEffect, useState } from 'react'

import { listen, on } from '../../../utils/events'

// Cobre a duração da animação de saída (ver Modal.module.scss) — só depois
// disso o estado volta a "fechado" e as classes de animação saem, senão o
// modal "pisca" para o estado oculto antes de a animação terminar.
const CLOSE_ANIMATION_DURATION = 200

interface UseModalParams {
  openEventName: string
  closeEventName?: string
  onClose?: () => void
}

// Mesma mecânica do useDrawer (barramento de eventos + scroll-lock + Esc),
// mas para um modal centralizado que monta/desmonta via portal.
export function useModal({
  openEventName,
  closeEventName,
  onClose,
}: UseModalParams) {
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

  // Só escuta o evento de fechamento enquanto aberto — fechar um modal já
  // fechado dispararia a animação de saída sobre um card oculto.
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
    // o conteúdo da página se desloca (layout shift) na abertura/fechamento.
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
