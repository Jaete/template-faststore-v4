import type { GalleryMedia } from '../Gallery.types'

export interface MainImageProps {
  /** Todas as mídias da galeria — o carrossel exibe uma por vez. */
  items: GalleryMedia[]
  /** Índice ativo (controlado pela Gallery, compartilhado com o ThumbRail). */
  activeIndex: number
  /** Chamado quando o swipe troca a imagem — sincroniza o índice na Gallery. */
  onActiveIndexChange: (index: number) => void
  /** Dispara a abertura do zoom/tela cheia (Fase futura). */
  onMaximize?: () => void
}
