import Media from '../../ui/Media/Media'
import { useCategoryName } from './usePlpBanner'
import type { PlpBannerProps } from './PlpBanner.types'
import styles from './PlpBanner.module.scss'

function PlpBanner({
  variant = 'image',
  title,
  useCategoryName: useCategoryNameFlag = false,
  image,
  mobileImage,
}: PlpBannerProps) {
  const categoryName = useCategoryName()

  // Quando "puxar nome da categoria" está ligado e há categoria, o título vem
  // dela (capitalizado via CSS); senão, cai no título manual do CMS.
  const usingCategory = useCategoryNameFlag && Boolean(categoryName)
  const displayTitle = usingCategory ? categoryName : title
  const titleClassName = usingCategory
    ? ` ${styles['plpBanner__title--capitalize']}`
    : ''

  // Variante "Apenas título": sem imagem, só o título centralizado no espaço
  // onde ficaria o banner.
  if (variant === 'titleOnly') {
    if (!displayTitle) {
      return null
    }

    return (
      <div className={`${styles.plpBanner} ${styles['plpBanner--titleOnly']}`}>
        <h1 className={`${styles.plpBanner__centeredTitle}${titleClassName}`}>
          {displayTitle}
        </h1>
      </div>
    )
  }

  if (!displayTitle && !image?.src && !mobileImage?.src) {
    return null
  }

  // Imagem mobile é opcional: quando existe, desktop e mobile são renderizados
  // e alternados por CSS (SSR-safe, sem layout shift). Sem imagem mobile, a
  // imagem desktop vale para todos os dispositivos.
  const hasMobileImage = Boolean(mobileImage?.src)

  return (
    <div className={styles.plpBanner}>
      {image?.src && (
        <Media
          src={image.src}
          alt={image.alt ?? ''}
          type="image"
          className={`${styles.plpBanner__media}${
            hasMobileImage ? ` ${styles['plpBanner__media--desktop']}` : ''
          }`}
        />
      )}

      {hasMobileImage && (
        <Media
          src={mobileImage!.src}
          alt={mobileImage!.alt ?? image?.alt ?? ''}
          type="image"
          className={`${styles.plpBanner__media} ${styles['plpBanner__media--mobile']}`}
        />
      )}

      {displayTitle && (
        <h1 className={`${styles.plpBanner__title}${titleClassName}`}>
          {displayTitle}
        </h1>
      )}
    </div>
  )
}

export default PlpBanner
