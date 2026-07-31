import { useMemo, useRef, useState } from 'react'

import Carousel from '../../ui/Carousel/Carousel'
import CarouselArrows from '../../ui/Carousel/Arrows/Arrows'
import CategoryCard from './CategoryCard/CategoryCard'
import type { PopularCategoriesProps } from './PopularCategories.types'
import styles from './PopularCategories.module.scss'
import { renderRichText } from '../../../utils/renderRichText'

function PopularCategories({ title, categories }: PopularCategoriesProps) {
  const titleHtml = useMemo(() => renderRichText(title), [title])
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  if (!categories?.length) {
    return null
  }

  return (
    <div className={styles.popularCategories}>
      {titleHtml && (
        <div
          className={styles.popularCategories__title}
          dangerouslySetInnerHTML={{ __html: titleHtml }}
        />
      )}

      <div className={styles.popularCategories__carouselWrapper}>
        <Carousel
          containerRef={carouselRef}
          className={styles.popularCategories__carousel}
          items={categories}
          getItemKey={(category) => category.href ?? category.label}
          renderItem={(category) => <CategoryCard {...category} />}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
        />

        <CarouselArrows
          containerRef={carouselRef}
          className={styles.popularCategories__arrows}
          activeIndex={activeIndex}
          itemCount={categories.length}
          onActiveIndexChange={setActiveIndex}
        />
      </div>
    </div>
  )
}

export default PopularCategories
