import type { GalleryMedia } from '../Gallery.types'

export interface GalleryZoomModalProps {
  isOpen: boolean
  onClose: () => void
  items: GalleryMedia[]
  activeIndex: number
  onActiveIndexChange: (index: number) => void
}
