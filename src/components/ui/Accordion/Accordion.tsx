import { useId, useState } from 'react'
import type { CSSProperties } from 'react'

import { ChevronDownFilledIcon, MinusIcon, PlusIcon } from '../Icons'
import type { AccordionProps } from './Accordion.types'
import styles from './Accordion.module.scss'

function Accordion({
  title,
  defaultOpen = false,
  contentPadding,
  icon = 'chevron',
  children,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <div
      className={styles.accordion}
      style={
        contentPadding !== undefined
          ? ({
              '--fs-accordion-content-padding': `${contentPadding}px`,
            } as CSSProperties)
          : undefined
      }
    >
      <button
        type="button"
        className={styles.accordion__header}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={styles.accordion__title}>{title}</span>
        {icon === 'plusMinus' ? (
          isOpen ? (
            <MinusIcon className={styles.accordion__icon} />
          ) : (
            <PlusIcon className={styles.accordion__icon} />
          )
        ) : (
          <ChevronDownFilledIcon
            className={
              isOpen
                ? `${styles.accordion__icon} ${styles['accordion__icon--open']}`
                : styles.accordion__icon
            }
          />
        )}
      </button>
      <div
        className={
          isOpen
            ? `${styles.accordion__contentWrapper} ${styles['accordion__contentWrapper--open']}`
            : styles.accordion__contentWrapper
        }
        aria-hidden={!isOpen}
      >
        <div id={contentId} className={styles.accordion__content}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Accordion
