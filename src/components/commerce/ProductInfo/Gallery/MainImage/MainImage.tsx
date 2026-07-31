import { useRef } from 'react'

import Media from '../../../../ui/Media/Media'
import Carousel from '../../../../ui/Carousel/Carousel'
import Arrows from '../../../../ui/Carousel/Arrows/Arrows'
import { MaximizeIcon } from '../../../../ui/Icons'
import type { MainImageProps } from './MainImage.types'
import styles from './MainImage.module.scss'

/**
 * Imagem principal da galeria montada sobre o `Carousel` horizontal: arrastar
 * (swipe) troca a imagem e sincroniza o índice ativo com o ThumbRail. O botão
 * de maximizar fica como overlay fixo, fora do carrossel. No mobile, setas
 * laterais (variante plain) sobrepõem a imagem — escondidas no desktop via CSS.
 */
function MainImage({
  items,
  activeIndex,
  onActiveIndexChange,
  onMaximize,
}: MainImageProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  if (!items.length) {
    return null
  }

  return (
    <div className={styles.mainImage}>
      <Carousel
        items={items}
        loop
        activeIndex={activeIndex}
        onActiveIndexChange={onActiveIndexChange}
        containerRef={carouselRef}
        className={styles.mainImage__carousel}
        getItemKey={(item, index) => `${item.src}-${index}`}
        renderItem={(media) => (
          <Media
            className={styles.mainImage__media}
            src={media.src}
            alt={media.alt}
            type={media.type}
            poster={media.poster}
          />
        )}
      />

      <Arrows
        className={styles.mainImage__arrows}
        containerRef={carouselRef}
        activeIndex={activeIndex}
        itemCount={items.length}
        onActiveIndexChange={onActiveIndexChange}
        variant="plain"
        loop
      />

      <button
        type="button"
        className={styles.mainImage__maximize}
        onClick={onMaximize}
        aria-label="Ampliar imagem"
      >
        <MaximizeIcon />
      </button>
    </div>
  )
}

export default MainImage
