import clsx from 'clsx'

import { useBreadcrumb } from './useBreadcrumb'
import type { BreadcrumbProps } from './Breadcrumb.types'
import styles from './Breadcrumb.module.scss'

function Breadcrumb({
  items,
  homeLabel = 'Home',
  bleed = false,
  invertColor = false,
}: BreadcrumbProps) {
  const { breadcrumbList } = useBreadcrumb({ items })

  const className = clsx(
    styles.breadcrumb,
    bleed && styles['breadcrumb--bleed'],
    invertColor && styles['breadcrumb--inverted']
  )

  return (
    <nav className={className} aria-label="breadcrumb">
      <ol className={styles.breadcrumb__list}>
        <li className={styles.breadcrumb__item}>
          <a className={styles.breadcrumb__link} href="/">
            {homeLabel}
          </a>
        </li>
        {breadcrumbList.map((breadcrumbItem, index) => {
          const isLast = index === breadcrumbList.length - 1

          return (
            <li
              key={breadcrumbItem.position ?? breadcrumbItem.item}
              className={styles.breadcrumb__item}
            >
              <span
                className={styles.breadcrumb__separator}
                aria-hidden="true"
              />
              {isLast ? (
                <span
                  className={styles.breadcrumb__current}
                  aria-current="page"
                >
                  {breadcrumbItem.name.toLocaleLowerCase()}
                </span>
              ) : (
                <a
                  className={styles.breadcrumb__link}
                  href={breadcrumbItem.item}
                >
                  {breadcrumbItem.name.toLocaleLowerCase()}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
