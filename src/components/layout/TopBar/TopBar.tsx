import { Fragment, useMemo } from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from '../../ui/Icons'
import type { TopBarProps } from './TopBar.types'
import { useTopBar } from './useTopBar'
import styles from './TopBar.module.scss'
import { renderRichText } from '../../../utils/renderRichText'

const MAX_LINKS = 3

function TopBar({ benefits, links = [] }: TopBarProps) {
  const {
    currentBenefit,
    currentIndex,
    hasMultipleBenefits,
    goToPrevious,
    goToNext,
  } = useTopBar({
    benefits,
  })
  const visibleLinks = links.slice(0, MAX_LINKS)

  // HTML dos benefícios calculado uma vez por lista — sem isso, cada tick do
  // auto-advance do carrossel reprocessaria o rich text
  const benefitsHtml = useMemo(
    () => benefits.map((benefit) => renderRichText(benefit) ?? ''),
    [benefits]
  )

  return (
    <div className={styles.topBar}>
      {currentBenefit && (
        <div className={styles.topBar__carousel}>
          {hasMultipleBenefits && (
            <button
              type="button"
              className={styles.topBar__arrow}
              onClick={goToPrevious}
              aria-label="Benefício anterior"
            >
              <ChevronLeftIcon className={styles.topBar__arrowIcon} />
            </button>
          )}

          <span
            key={currentIndex}
            className={styles.topBar__benefit}
            dangerouslySetInnerHTML={{
              __html: benefitsHtml[currentIndex] ?? '',
            }}
          />

          {hasMultipleBenefits && (
            <button
              type="button"
              className={styles.topBar__arrow}
              onClick={goToNext}
              aria-label="Próximo benefício"
            >
              <ChevronRightIcon className={styles.topBar__arrowIcon} />
            </button>
          )}
        </div>
      )}

      {visibleLinks.length > 0 && (
        <nav className={styles.topBar__links} aria-label="Links institucionais">
          {visibleLinks.map((link, index) => (
            <Fragment key={`${index}-${link.href}`}>
              <a href={link.href} className={styles.topBar__link}>
                {link.label}
              </a>

              {index < visibleLinks.length - 1 && (
                <span className={styles.topBar__separator} aria-hidden="true">
                  |
                </span>
              )}
            </Fragment>
          ))}
        </nav>
      )}
    </div>
  )
}

export default TopBar
