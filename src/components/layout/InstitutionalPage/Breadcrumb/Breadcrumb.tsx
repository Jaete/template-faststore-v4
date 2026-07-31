import type { BreadcrumbProps } from './Breadcrumb.types'
import styles from './Breadcrumb.module.scss'

function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.breadcrumb__list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className={styles.breadcrumb__item}>
              {item.href && !isLast ? (
                <a href={item.href} className={styles.breadcrumb__link}>
                  {item.label}
                </a>
              ) : (
                <span
                  className={styles.breadcrumb__current}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span
                  className={styles.breadcrumb__separator}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
