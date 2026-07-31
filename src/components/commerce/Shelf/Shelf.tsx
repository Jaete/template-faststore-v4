import { useRef } from 'react'

import Carousel from '../../ui/Carousel/Carousel'
import CarouselArrows from '../../ui/Carousel/Arrows/Arrows'
import PaginationDots from '../../ui/PaginationDots/PaginationDots'
import ProductCard from '../ProductCard/ProductCard'
import { useMergedRef } from '../../../hooks/useMergedRef'
import { useShelf } from './useShelf'
import type { ShelfProps } from './Shelf.types'
import type { ProductCardData } from '../ProductCard/ProductCard.types'
import styles from './Shelf.module.scss'

interface ShelfSlot {
  key: string
  product?: ProductCardData
}

function Shelf({
  title,
  collectionId = '',
  categoryId = '',
  term = '',
  bestSellers = false,
  numberOfItems = 10,
  visibleItems = 1,
  variant = 'default',
  containerRef: externalContainerRef,
  activeIndex,
  onActiveIndexChange,
  onItemsChange,
  showArrows = true,
  showPaginationDots = false,
}: ShelfProps) {
  const {
    products,
    isLoading,
    positionCount,
    activeIndex: currentIndex,
    onActiveIndexChange: handleActiveIndexChange,
  } = useShelf({
    collectionId,
    categoryId,
    term,
    bestSellers,
    numberOfItems,
    visibleItems,
    activeIndex,
    onActiveIndexChange,
    onItemsChange,
  })

  const internalContainerRef = useRef<HTMLDivElement>(null)
  const mergedContainerRef = useMergedRef(
    internalContainerRef,
    externalContainerRef
  )

  if (!isLoading && !products.length) {
    return null
  }

  const slots: ShelfSlot[] = isLoading
    ? Array.from({ length: numberOfItems }, (_, index) => ({
        key: `skeleton-${index}`,
      }))
    : products.map((product) => ({
        key: product.href ?? product.name,
        product,
      }))

  return (
    <div className={styles.shelf}>
      {title && <h2 className={styles.shelf__title}>{title}</h2>}

      <div className={styles.shelf__carouselWrapper}>
        <Carousel
          containerRef={mergedContainerRef}
          className={styles.shelf__carousel}
          items={slots}
          getItemKey={(slot) => slot.key}
          renderItem={(slot) => (
            <ProductCard
              product={slot.product}
              isLoading={isLoading}
              variant={variant}
            />
          )}
          activeIndex={currentIndex}
          onActiveIndexChange={handleActiveIndexChange}
        />

        {showArrows && !isLoading && (
          <CarouselArrows
            containerRef={internalContainerRef}
            className={styles.shelf__arrows}
            activeIndex={currentIndex}
            itemCount={positionCount}
            onActiveIndexChange={handleActiveIndexChange}
          />
        )}
      </div>

      {showPaginationDots && !isLoading && (
        <PaginationDots
          className={styles.shelf__dots}
          activeIndex={currentIndex}
          itemCount={positionCount}
          onSelect={handleActiveIndexChange}
        />
      )}
    </div>
  )
}

export default Shelf
