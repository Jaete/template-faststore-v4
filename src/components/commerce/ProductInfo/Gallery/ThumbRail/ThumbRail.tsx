import { useRef } from 'react'

import Media from '../../../../ui/Media/Media'
import Carousel from '../../../../ui/Carousel/Carousel'
import { useOverflow } from '../../../../../hooks/useOverflow'
import { PlayIcon, CaretCircleUpIcon } from '../../../../ui/Icons'
import type { GalleryMedia } from '../Gallery.types'
import type { ThumbRailProps } from './ThumbRail.types'
import styles from './ThumbRail.module.scss'

function isVideoMedia(item: GalleryMedia): boolean {
  return (
    item.type === 'video' ||
    (item.type == null && /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(item.src))
  )
}

/**
 * Coluna vertical de thumbnails da galeria, montada sobre o `Carousel`
 * vertical: arrastar (swipe) troca o thumb ativo e a seta inferior avança o
 * índice (dando a volta pro primeiro ao passar do último). O carrossel traz o
 * thumb ativo para dentro do overflow automaticamente; o thumb de vídeo ganha
 * um overlay com ícone de play.
 */
function ThumbRail({
  items,
  activeIndex,
  onActiveIndexChange,
}: ThumbRailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasOverflow = useOverflow(containerRef, [items.length], 'vertical')

  if (!items.length) {
    return null
  }

  const lastIndex = items.length - 1

  // Seta única (inferior): avança e, ao passar do último, dá a volta pro
  // primeiro. Como o índice é compartilhado com o MainImage, a imagem
  // principal acompanha.
  const goToNext = () => {
    onActiveIndexChange(activeIndex < lastIndex ? activeIndex + 1 : 0)
  }

  return (
    <div className={styles.rail}>
      <Carousel
        items={items}
        orientation="vertical"
        activeIndex={activeIndex}
        onActiveIndexChange={onActiveIndexChange}
        containerRef={containerRef}
        className={styles.rail__list}
        getItemKey={(item, index) => `${item.src}-${index}`}
        renderItem={(item, index) => {
          const isVideo = isVideoMedia(item)

          return (
            <button
              type="button"
              className={`${styles.rail__thumb}${
                index === activeIndex ? ` ${styles['rail__thumb--active']}` : ''
              }`}
              onClick={() => onActiveIndexChange(index)}
              aria-label={`Ver imagem ${index + 1}`}
              aria-current={index === activeIndex}
            >
              <Media
                className={styles.rail__thumbMedia}
                src={isVideo ? (item.poster ?? item.src) : item.src}
                alt={item.alt}
                type="image"
              />

              {isVideo && (
                <span className={styles.rail__playOverlay} aria-hidden="true">
                  <PlayIcon />
                </span>
              )}
            </button>
          )
        }}
      />

      {hasOverflow && (
        <button
          type="button"
          className={`${styles.rail__arrow} ${styles['rail__arrow--down']}`}
          onClick={goToNext}
          aria-label="Próxima imagem"
        >
          <CaretCircleUpIcon />
        </button>
      )}
    </div>
  )
}

export default ThumbRail
