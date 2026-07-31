import type { GalleryMedia } from '../Gallery.types'

export interface ThumbRailProps {
  /** Mídias da galeria. */
  items: GalleryMedia[]
  /** Índice selecionado (0-based). */
  activeIndex: number
  /** Chamado ao selecionar um thumbnail. */
  onActiveIndexChange: (index: number) => void
}
