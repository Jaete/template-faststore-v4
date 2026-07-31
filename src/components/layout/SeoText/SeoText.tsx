import type { SeoTextProps } from './SeoText.types'
import styles from './SeoText.module.scss'
import { renderRichText } from '../../../utils/renderRichText'

function SeoText({
  title,
  description,
  linkLabel = 'Ver mais',
  linkHref = '/duvidas-frequentes',
}: SeoTextProps) {
  return (
    <section className={styles.seoText}>
      <div className={styles.seoText__container}>
        <h2 className={styles.seoText__title}>{title}</h2>
        <div
          className={styles.seoText__description}
          dangerouslySetInnerHTML={{
            __html: renderRichText(description) ?? '',
          }}
        />
        {linkHref && (
          <a className={styles.seoText__link} href={linkHref}>
            {linkLabel}
          </a>
        )}
      </div>
    </section>
  )
}

export default SeoText
