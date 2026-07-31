import { useMemo } from 'react'

import Button from '../Button/Button'
import Media from '../Media/Media'
import { renderRichText } from '../../../utils/renderRichText'
import type { BannerProps } from './Banner.types'
import styles from './Banner.module.scss'

function Banner({
  label,
  title,
  subtitle,
  media,
  href,
  buttonLabel,
  buttonVariant = 'stroke-white',
}: BannerProps) {
  const labelHtml = useMemo(() => renderRichText(label), [label])
  const titleHtml = useMemo(() => renderRichText(title), [title])
  const subtitleHtml = useMemo(() => renderRichText(subtitle), [subtitle])

  return (
    <div className={styles.banner}>
      <Media
        src={media.src}
        alt={media.alt}
        type={media.type}
        className={styles.banner__media}
      />
      <div className={styles.banner__overlay} />

      <div className={styles.banner__content}>
        {labelHtml && (
          <span
            className={styles.banner__label}
            dangerouslySetInnerHTML={{ __html: labelHtml }}
          />
        )}

        {titleHtml && (
          <h2
            className={styles.banner__title}
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />
        )}

        {subtitleHtml && (
          <p
            className={styles.banner__subtitle}
            dangerouslySetInnerHTML={{ __html: subtitleHtml }}
          />
        )}

        {buttonLabel && (
          <div className={styles.banner__button}>
            <Button label={buttonLabel} href={href} variant={buttonVariant} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Banner
