import type { CSSProperties } from 'react'
import Link from 'next/link'

import type { ProductCardProps } from './ProductCard.types'
import { useProductCard } from './useProductCard'
import styles from './ProductCard.module.scss'

function ProductCard({
  product,
  isLoading = false,
  maxVisibleColors = 4,
  variant = 'default',
  animationIndex,
}: ProductCardProps) {
  const {
    hasDiscount,
    discountLabel,
    formattedListPrice,
    formattedSellingPrice,
    visibleColors,
    hiddenColorsCount,
    image,
    href,
    selectColor,
  } = useProductCard({ product, maxVisibleColors })

  const rootClassName =
    variant === 'small'
      ? `${styles.productCard} ${styles['productCard--small']}`
      : styles.productCard

  if (isLoading) {
    return (
      <div
        className={`${rootClassName} ${styles['productCard--skeleton']}`}
        aria-hidden="true"
      >
        <div className={styles.productCard__imageContainer} />

        <div className={styles.productCard__info}>
          <span
            className={`${styles.productCard__skeletonLine} ${styles['productCard__skeletonLine--name']}`}
          />
          <span
            className={`${styles.productCard__skeletonLine} ${styles['productCard__skeletonLine--price']}`}
          />
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const { name } = product

  const content = (
    <>
      {href && (
        <Link
          href={href}
          className={styles.productCard__link}
          aria-label={name}
        />
      )}

      <div className={styles.productCard__imageContainer}>
        <img
          className={styles.productCard__image}
          src={image?.src}
          alt={image?.alt ?? name}
        />

        {hasDiscount && (
          <span className={styles.productCard__discountTag}>
            {discountLabel}
          </span>
        )}
      </div>

      <div className={styles.productCard__info}>
        <h3 className={styles.productCard__name}>{name}</h3>

        <div className={styles.productCard__priceRow}>
          <div className={styles.productCard__prices}>
            {hasDiscount && (
              <span className={styles.productCard__listPrice}>
                {formattedListPrice}
              </span>
            )}
            <span className={styles.productCard__sellingPrice}>
              {formattedSellingPrice}
            </span>
          </div>

          {visibleColors.length > 0 && (
            <div className={styles.productCard__colors}>
              {visibleColors.map((color) => {
                const colorClassName = [
                  styles.productCard__colorOption,
                  color.selected &&
                    styles['productCard__colorOption--selected'],
                  color.isWhite &&
                    !color.selected &&
                    styles['productCard__colorOption--white'],
                ]
                  .filter(Boolean)
                  .join(' ')

                const colorStyle = color.hex
                  ? { backgroundColor: color.hex }
                  : color.src
                    ? { backgroundImage: `url(${color.src})` }
                    : undefined

                return (
                  <button
                    key={color.label}
                    type="button"
                    onClick={() => selectColor(color.value)}
                    className={colorClassName}
                    style={colorStyle}
                    title={color.label}
                    aria-label={color.label}
                    aria-pressed={color.selected}
                  />
                )
              })}

              {hiddenColorsCount > 0 && (
                <span className={styles.productCard__colorsMore}>
                  +{hiddenColorsCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )

  const shouldAnimate =
    typeof animationIndex === 'number' && animationIndex >= 0

  const className = shouldAnimate
    ? `${rootClassName} ${styles['productCard--animateIn']}`
    : rootClassName

  // `--card-index` alimenta o `animation-delay` no SCSS, escalonando a entrada
  // de cada card sequencialmente.
  const animationStyle = shouldAnimate
    ? ({ '--card-index': animationIndex } as CSSProperties)
    : undefined

  return (
    <div className={className} style={animationStyle}>
      {content}
    </div>
  )
}

export default ProductCard
