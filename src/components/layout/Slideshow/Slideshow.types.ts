import type { BannerProps } from '../../ui/Banner/Banner.types'

export interface SlideshowProps {
  banners: BannerProps[]
  autoplayInterval?: number
}
