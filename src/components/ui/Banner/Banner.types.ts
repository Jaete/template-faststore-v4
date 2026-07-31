import type { ButtonProps } from '../Button/Button.types'
import type { MediaProps } from '../Media/Media.types'

export interface BannerMedia {
  src: string
  alt: string
  type?: MediaProps['type']
}

export interface BannerProps {
  label?: string
  title: string
  subtitle?: string
  media: BannerMedia
  href?: string
  buttonLabel?: string
  buttonVariant?: ButtonProps['variant']
}
