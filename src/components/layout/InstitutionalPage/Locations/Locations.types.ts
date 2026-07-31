import type { InstitutionalPageLocation } from '../InstitutionalPage.types'

export interface LocationsProps {
  items: InstitutionalPageLocation[]
  pinIconUrl?: string
  phoneIconUrl?: string
  clockIconUrl?: string
  directionsIconUrl?: string
}
