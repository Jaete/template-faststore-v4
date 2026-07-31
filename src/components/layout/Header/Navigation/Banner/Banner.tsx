import { ChevronRightIcon } from '../../../../ui/Icons'
import type { BannerProps } from './Banner.types'
import styles from './Banner.module.scss'

function Banner({ label, href, imageSrc, imageAlt = '' }: BannerProps) {
  return (
    <a href={href} className={styles.banner}>
      <img
        src={imageSrc}
        alt={imageAlt}
        className={styles.banner__image}
        loading="lazy"
      />

      <span className={styles.banner__label}>{label}</span>

      <span className={styles.banner__arrow} aria-hidden="true">
        <ChevronRightIcon className={styles.banner__arrowIcon} />
      </span>
    </a>
  )
}

export default Banner
