import Carousel from '../../../ui/Carousel/Carousel'
import type { CategoryCarouselProps } from './CategoryCarousel.types'
import styles from './CategoryCarousel.module.scss'

function CategoryCarousel({ categories }: CategoryCarouselProps) {
  if (!categories?.length) {
    return null
  }

  return (
    <Carousel
      items={categories}
      getItemKey={(category) => category.link.href}
      renderItem={(category) => (
        <a
          href={category.link.href}
          className={styles.categoryCarousel__card}
          draggable={false}
        >
          <div className={styles.categoryCarousel__imageContainer}>
            <img
              src={category.imageSrc}
              alt={category.imageAlt ?? category.name}
              className={styles.categoryCarousel__image}
              loading="lazy"
              draggable={false}
            />
          </div>

          <div className={styles.categoryCarousel__text}>
            <p className={styles.categoryCarousel__title}>{category.name}</p>
            <p className={styles.categoryCarousel__subtitle}>
              {category.link.label ?? 'Acesse a categoria'}
            </p>
          </div>
        </a>
      )}
    />
  )
}

export default CategoryCarousel
