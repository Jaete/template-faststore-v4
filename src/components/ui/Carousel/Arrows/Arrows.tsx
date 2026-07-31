import { useArrows } from './useArrows'
import type { ArrowsProps } from './Arrows.types'
import styles from './Arrows.module.scss'

function Arrows({
  containerRef,
  activeIndex,
  itemCount,
  onActiveIndexChange,
  loop = false,
  orientation = 'horizontal',
  variant = 'circle',
  only,
  className,
}: ArrowsProps) {
  const { hasOverflow, canGoPrevious, canGoNext, goToPrevious, goToNext } =
    useArrows({
      containerRef,
      activeIndex,
      itemCount,
      onActiveIndexChange,
      loop,
      orientation,
    })

  if (!hasOverflow) {
    return null
  }

  const isPlain = variant === 'plain'
  const buttonModifier = isPlain ? ` ${styles['arrows__button--plain']}` : ''

  return (
    <div
      className={className ? `${styles.arrows} ${className}` : styles.arrows}
    >
      {only !== 'next' && (isPlain || canGoPrevious) && (
        <button
          type="button"
          className={`${styles.arrows__button} ${styles['arrows__button--previous']}${buttonModifier}`}
          onClick={goToPrevious}
          disabled={isPlain && !canGoPrevious}
          aria-label="Item anterior"
        >
          <svg
            className={styles.arrows__icon}
            viewBox="0 0 7 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6.25 10.75L1.25 5.75L6.25 0.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {only !== 'previous' && (isPlain || canGoNext) && (
        <button
          type="button"
          className={`${styles.arrows__button} ${styles['arrows__button--next']}${buttonModifier}`}
          onClick={goToNext}
          disabled={isPlain && !canGoNext}
          aria-label="Próximo item"
        >
          <svg
            className={styles.arrows__icon}
            viewBox="0 0 7 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0.75 10.75L5.75 5.75L0.75 0.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export default Arrows
