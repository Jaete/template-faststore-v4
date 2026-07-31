import { useState } from 'react'

import { useActiveSku } from '../../../providers/ActiveSkuProvider/ActiveSkuProvider'
import ThumbRail from './ThumbRail/ThumbRail'
import MainImage from './MainImage/MainImage'
import Counter from './Counter/Counter'
import PaginationDots from '../../../ui/PaginationDots/PaginationDots'
import GalleryZoomModal from './GalleryZoomModal/GalleryZoomModal'
import { useGallery } from './useGallery'
import styles from './Gallery.module.scss'

/**
 * Galeria de imagens da PDP: rail vertical de thumbnails + contador à esquerda,
 * imagem principal à direita.
 *
 * As imagens vêm do SKU ativo (contexto), não de prop: trocar a variante troca a
 * galeria automaticamente. Isso atende a troca de cor sem precisar de nenhuma
 * regra especial para "cor" — qualquer SKU com imagens próprias funciona.
 */
function Gallery() {
  const { product } = useActiveSku()
  const { items, activeIndex, setActiveIndex } = useGallery({
    images: product?.image,
  })
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  if (!items.length) {
    return null
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.gallery__rail}>
        <ThumbRail
          items={items}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
        />
        <Counter activeIndex={activeIndex} total={items.length} />
      </div>

      <MainImage
        items={items}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        onMaximize={() => setIsZoomOpen(true)}
      />

      {/* Mobile: rail some e o slider ganha paginação por barrinhas. */}
      <PaginationDots
        className={styles.gallery__dots}
        itemCount={items.length}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
      />

      <GalleryZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        items={items}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
      />
    </div>
  )
}

export default Gallery
