import type { PaginationDotsProps } from './PaginationDots.types'
import styles from './PaginationDots.module.scss'

function PaginationDots({
  itemCount,
  activeIndex,
  onSelect,
  className,
}: PaginationDotsProps) {
  if (itemCount <= 1) {
    return null
  }

  return (
    <div
      className={
        className
          ? `${styles.paginationDots} ${className}`
          : styles.paginationDots
      }
      role="tablist"
      aria-label="Paginação do carrossel"
    >
      {Array.from({ length: itemCount }, (_, index) => {
        const isActive = index === activeIndex

        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Ir para o item ${index + 1}`}
            tabIndex={onSelect ? 0 : -1}
            disabled={!onSelect}
            className={
              isActive
                ? `${styles.paginationDots__dot} ${styles['paginationDots__dot--active']}`
                : styles.paginationDots__dot
            }
            onClick={() => onSelect?.(index)}
          />
        )
      })}
    </div>
  )
}

export default PaginationDots
