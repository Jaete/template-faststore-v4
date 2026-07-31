import { PlayIcon } from '../Icons'
import type { VideoBannerProps } from './VideoBanner.types'
import { getYoutubeEmbedUrl, useVideoBanner } from './useVideoBanner'
import styles from './VideoBanner.module.scss'

function VideoBanner({
  title,
  thumbnailUrl,
  videoUrl,
  logoUrl,
  compact,
}: VideoBannerProps) {
  const { isPlaying, play } = useVideoBanner()

  return (
    <section
      className={[
        styles.videoBanner,
        compact ? styles['videoBanner--compact'] : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <h3 className={styles.videoBanner__title}>{title}</h3>

      <div
        className={[
          styles.videoBanner__card,
          compact ? styles['videoBanner__card--compact'] : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div
          className={[
            styles.videoBanner__media,
            compact ? styles['videoBanner__media--compact'] : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={
            thumbnailUrl
              ? { backgroundImage: `url(${thumbnailUrl})` }
              : undefined
          }
        >
          {isPlaying && videoUrl ? (
            <iframe
              className={styles.videoBanner__player}
              src={`${getYoutubeEmbedUrl(videoUrl)}?autoplay=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt=""
                  className={styles.videoBanner__logo}
                />
              )}

              <button
                type="button"
                className={styles.videoBanner__playButton}
                onClick={play}
                aria-label={`Reproduzir vídeo: ${title}`}
              >
                <PlayIcon className={styles.videoBanner__playIcon} />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default VideoBanner
