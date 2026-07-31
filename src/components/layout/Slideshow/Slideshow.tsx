import Carousel from '../../ui/Carousel/Carousel'
import Banner from '../../ui/Banner/Banner'
import IconButton from '../../ui/IconButton/IconButton'
import { ChevronLeftIcon, ChevronRightIcon } from '../../ui/Icons'
import { useSlideshow } from './useSlideshow'
import type { SlideshowProps } from './Slideshow.types'
import styles from './Slideshow.module.scss'

function Slideshow({ banners, autoplayInterval = 6000 }: SlideshowProps) {
  const { activeIndex, goTo, next, prev } = useSlideshow({
    itemCount: banners.length,
    autoplayInterval,
  })

  if (!banners.length) {
    return null
  }

  return (
    <div className={styles.slideshow}>
      <Carousel
        className={styles.slideshow__carousel}
        items={banners}
        getItemKey={(banner, index) => banner.title ?? String(index)}
        renderItem={(banner) => <Banner {...banner} />}
        activeIndex={activeIndex}
        onActiveIndexChange={goTo}
        loop
      />

      {banners.length > 1 && (
        <>
          <div className={styles.slideshow__arrows}>
            <IconButton ariaLabel="Slide anterior" onClick={prev}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton ariaLabel="Próximo slide" onClick={next}>
              <ChevronRightIcon />
            </IconButton>
          </div>

          <div className={styles.slideshow__dots}>
            {banners.map((banner, index) => (
              <button
                key={banner.title ?? index}
                type="button"
                aria-label={`Ir para o slide ${index + 1}`}
                className={
                  index === activeIndex
                    ? `${styles.slideshow__dot} ${styles['slideshow__dot--active']}`
                    : styles.slideshow__dot
                }
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Slideshow
