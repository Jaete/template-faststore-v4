import type { CategoryCardProps } from './CategoryCard.types'
import styles from './CategoryCard.module.scss'

function CategoryCard({ label, image, href = '' }: CategoryCardProps) {
  const content = (
    <>
      <div className={styles.categoryCard__visual}>
        <div className={styles.categoryCard__ellipse} />

        <img
          className={styles.categoryCard__image}
          src={image.src}
          alt={image.alt ?? label}
        />
      </div>

      <p className={styles.categoryCard__label}>{label}</p>
    </>
  )

  if (href) {
    return (
      <a href={href} className={styles.categoryCard}>
        {content}
      </a>
    )
  }

  return <div className={styles.categoryCard}>{content}</div>
}

export default CategoryCard
