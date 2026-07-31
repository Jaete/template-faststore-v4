/** Item de mídia normalizado da galeria (imagem ou vídeo). */
export interface GalleryMedia {
  /** URL da imagem/vídeo. */
  src: string
  /** Texto alternativo / rótulo acessível. */
  alt: string
  /** Tipo da mídia; inferido pela extensão quando ausente. */
  type?: 'image' | 'video'
  /** Frame de pôster para itens de vídeo. */
  poster?: string
}
