import { ClockIcon, PhoneIcon, PinIcon } from '../../../ui/Icons'
import type { LocationCardProps } from './LocationCard.types'
import styles from './LocationCard.module.scss'

function LocationCard({
  name,
  imageUrl,
  address,
  phone,
  phoneHref,
  hours,
  mapsUrl,
  pinIconUrl,
  phoneIconUrl,
  clockIconUrl,
  directionsIconUrl,
}: LocationCardProps) {
  return (
    <div className={styles.locationCard}>
      <div
        className={styles.locationCard__image}
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      />

      <div className={styles.locationCard__body}>
        <span className={styles.locationCard__name}>{name}</span>

        {(address || phone || hours) && (
          <div className={styles.locationCard__rows}>
            {address && (
              <div className={styles.locationCard__row}>
                {pinIconUrl ? (
                  <img
                    src={pinIconUrl}
                    alt=""
                    className={styles.locationCard__icon}
                  />
                ) : (
                  <PinIcon className={styles.locationCard__icon} />
                )}
                <span>{address}</span>
              </div>
            )}

            {phone && (
              <div className={styles.locationCard__row}>
                {phoneIconUrl ? (
                  <img
                    src={phoneIconUrl}
                    alt=""
                    className={styles.locationCard__icon}
                  />
                ) : (
                  <PhoneIcon className={styles.locationCard__icon} />
                )}
                {phoneHref ? (
                  <a href={phoneHref}>{phone}</a>
                ) : (
                  <span>{phone}</span>
                )}
              </div>
            )}

            {hours && (
              <div className={styles.locationCard__row}>
                {clockIconUrl ? (
                  <img
                    src={clockIconUrl}
                    alt=""
                    className={styles.locationCard__icon}
                  />
                ) : (
                  <ClockIcon className={styles.locationCard__icon} />
                )}
                <span>{hours}</span>
              </div>
            )}
          </div>
        )}

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.locationCard__directions}
          >
            {directionsIconUrl ? (
              <img
                src={directionsIconUrl}
                alt=""
                className={styles.locationCard__directionsIcon}
              />
            ) : (
              <PinIcon className={styles.locationCard__directionsIconDefault} />
            )}
            Como chegar
          </a>
        )}
      </div>
    </div>
  )
}

export default LocationCard
