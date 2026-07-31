import { useCallback, useEffect, useState } from 'react'

import { on } from '../../../../../utils/events'

const CLOSE_ANIMATION_DURATION = 200

interface UseGalleryZoomModalParams {
  isOpen: boolean
  onClose: () => void
}

export function useGalleryZoomModal({
  isOpen,
  onClose,
}: UseGalleryZoomModalParams) {
  const [isClosing, setIsClosing] = useState(false)

  const close = useCallback(() => {
    setIsClosing(true)
    window.setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, CLOSE_ANIMATION_DURATION)
  }, [onClose])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const offKeyDown = on(document, 'keydown', (event) => {
      if (event.key === 'Escape') {
        close()
      }
    })

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

  return { isClosing, close }
}
