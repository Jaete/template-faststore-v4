import LocationCard from '../LocationCard/LocationCard'
import type { LocationsProps } from './Locations.types'
import styles from '../InstitutionalPage.module.scss'

function Locations({
  items,
  pinIconUrl,
  phoneIconUrl,
  clockIconUrl,
  directionsIconUrl,
}: LocationsProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className={styles.institutionalPage__locations}>
      {items.map((location, index) => (
        <LocationCard
          key={index}
          name={location.name}
          imageUrl={location.imageUrl}
          address={location.address}
          phone={location.phone}
          phoneHref={location.phoneHref}
          hours={location.hours}
          mapsUrl={location.mapsUrl}
          pinIconUrl={pinIconUrl}
          phoneIconUrl={phoneIconUrl}
          clockIconUrl={clockIconUrl}
          directionsIconUrl={directionsIconUrl}
        />
      ))}
    </div>
  )
}

export default Locations
