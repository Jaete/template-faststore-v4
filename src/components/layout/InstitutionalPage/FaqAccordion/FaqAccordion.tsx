import { CaretDownIcon } from '../../../ui/Icons'
import {
  hasVisibleContent,
  renderRichText,
} from '../../../../utils/renderRichText'
import type { FaqAccordionProps } from './FaqAccordion.types'
import { useFaqAccordion } from './useFaqAccordion'
import styles from './FaqAccordion.module.scss'

function FaqAccordion({ items }: FaqAccordionProps) {
  const { openIndex, toggle } = useFaqAccordion({ itemsCount: items.length })

  if (items.length === 0) {
    return null
  }

  return (
    <div className={styles.faqAccordion}>
      {items.map((item, index) => {
        const isOpen = index === openIndex
        const answerHtml = renderRichText(item.answer)
        const panelId = `faq-answer-${index}`

        return (
          <div
            key={index}
            className={[
              styles.faqAccordion__item,
              isOpen ? styles['faqAccordion__item--open'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <button
              type="button"
              className={styles.faqAccordion__question}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(index)}
            >
              <span>{item.question}</span>
              <CaretDownIcon
                className={[
                  styles.faqAccordion__icon,
                  isOpen ? styles['faqAccordion__icon--open'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            </button>

            {isOpen && hasVisibleContent(answerHtml) && (
              <div
                id={panelId}
                className={styles.faqAccordion__answer}
                dangerouslySetInnerHTML={{ __html: answerHtml ?? '' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default FaqAccordion
