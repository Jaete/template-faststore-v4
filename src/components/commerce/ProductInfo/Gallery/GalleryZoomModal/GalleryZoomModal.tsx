import { createPortal } from 'react-dom'
import { useRef } from 'react'

import Media from '../../../../ui/Media/Media'
import Carousel from '../../../../ui/Carousel/Carousel'
import { useArrows } from '../../../../ui/Carousel/Arrows/useArrows'
import {
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../../../../ui/Icons'
import { useGalleryZoomModal } from './useGalleryZoomModal'
import type { GalleryZoomModalProps } from './GalleryZoomModal.types'
import styles from './GalleryZoomModal.module.scss'

function GalleryZoomModal({
  isOpen,
  onClose,
  items,
  activeIndex,
  onActiveIndexChange,
}: GalleryZoomModalProps) {
  const { isClosing, close } = useGalleryZoomModal({ isOpen, onClose })
  const carouselRef = useRef<HTMLDivElement>(null)
  const { canGoPrevious, canGoNext, goToPrevious, goToNext } = useArrows({
    containerRef: carouselRef,
    activeIndex,
    itemCount: items.length,
    onActiveIndexChange,
    loop: true,
  })

  if (!isOpen && !isClosing) {
    return null
  }

  return createPortal(
    <div
      className={[
        styles.galleryZoomModal,
        isClosing ? styles['galleryZoomModal--closing'] : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={close}
      role="presentation"
    >
      <div
        className={styles.galleryZoomModal__container}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <Carousel
          items={items}
          activeIndex={activeIndex}
          onActiveIndexChange={onActiveIndexChange}
          containerRef={carouselRef}
          className={styles.galleryZoomModal__carousel}
          getItemKey={(item, index) => `${item.src}-${index}`}
          renderItem={(media: (typeof items)[number]) => (
            <Media
              className={styles.galleryZoomModal__media}
              src={media.src}
              alt={media.alt}
              type={media.type}
              poster={media.poster}
            />
          )}
        />

        <div className={styles.galleryZoomModal__controls}>
          <button
            type="button"
            className={`${styles.galleryZoomModal__arrow} ${styles['galleryZoomModal__arrow--previous']}`}
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            aria-label="Item anterior"
          >
            <ChevronLeftIcon />
          </button>

          <button
            type="button"
            className={styles.galleryZoomModal__close}
            onClick={close}
            aria-label="Fechar"
          >
            <CloseIcon />
          </button>

          <button
            type="button"
            className={`${styles.galleryZoomModal__arrow} ${styles['galleryZoomModal__arrow--next']}`}
            onClick={goToNext}
            disabled={!canGoNext}
            aria-label="Próximo item"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default GalleryZoomModal
