import { useRef, useState } from 'react'

import { useDevice } from '../../../hooks/useDevice'
import Carousel from '../../ui/Carousel/Carousel'
import CarouselArrows from '../../ui/Carousel/Arrows/Arrows'
import CategoryCard from '../../ui/CategoryCard/CategoryCard'
import { useCategoryQuickNavigation } from './useCategoryQuickNavigation'
import type { CategoryQuickNavigationProps } from './CategoryQuickNavigation.types'
import styles from './CategoryQuickNavigation.module.scss'

function CategoryQuickNavigation({
  title,
  items,
  showArrows,
}: CategoryQuickNavigationProps) {
  const { navigationItems } = useCategoryQuickNavigation({ items })
  const containerRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { isMobile } = useDevice()

  if (!navigationItems.length) {
    return null
  }

  // Setas habilitadas por dispositivo (default: exibir em ambos). `isMobile` só
  // é confiável após montar (SSR devolve false), o que casa com o comportamento
  // do próprio carrossel/setas, que dependem de layout medido no cliente.
  const arrowsEnabled = isMobile
    ? (showArrows?.mobile ?? true)
    : (showArrows?.desktop ?? true)

  return (
    <div className={styles.categoryQuickNavigation}>
      {title && (
        <h3 className={styles.categoryQuickNavigation__title}>{title}</h3>
      )}

      <div className={styles.categoryQuickNavigation__carousel}>
        <Carousel
          as="ul"
          items={navigationItems}
          getItemKey={(item) => item.href}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          containerRef={containerRef}
          renderItem={(item) => (
            <div className={styles.categoryQuickNavigation__item}>
              <CategoryCard
                label={item.title}
                image={item.image}
                href={item.href}
              />
            </div>
          )}
        />

        {arrowsEnabled && (
          <CarouselArrows
            containerRef={containerRef}
            activeIndex={activeIndex}
            itemCount={navigationItems.length}
            onActiveIndexChange={setActiveIndex}
            className={styles.categoryQuickNavigation__arrows}
          />
        )}
      </div>
    </div>
  )
}

export default CategoryQuickNavigation
