import {
  hasVisibleContent,
  renderRichText,
} from '../../../../utils/renderRichText'
import type { HighlightProps } from './Highlight.types'
import styles from '../InstitutionalPage.module.scss'

function Highlight({ highlight }: HighlightProps) {
  const textHtml = renderRichText(highlight.text)
  const hasContent = !!highlight.title || hasVisibleContent(textHtml)

  if (!hasContent) {
    return null
  }

  const cardStyle = highlight.cardStyle !== false

  return (
    <div
      className={[
        styles.institutionalPage__highlight,
        !cardStyle ? styles['institutionalPage__highlight--plain'] : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {highlight.title && (
        <h2 className={styles.institutionalPage__highlightTitle}>
          {highlight.title}
        </h2>
      )}

      {hasVisibleContent(textHtml) && (
        <div
          className={styles.institutionalPage__highlightText}
          dangerouslySetInnerHTML={{ __html: textHtml ?? '' }}
        />
      )}

      {highlight.buttonLabel && highlight.buttonHref && (
        <a
          href={highlight.buttonHref}
          className={styles.institutionalPage__highlightButton}
        >
          {highlight.buttonLabel}
        </a>
      )}
    </div>
  )
}

export default Highlight
