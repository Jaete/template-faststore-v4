export interface VideoBannerProps {
  /** Título exibido na faixa superior do banner */
  title: string
  /** Imagem de fundo exibida antes do play */
  thumbnailUrl?: string
  /** URL do vídeo reproduzido ao clicar no play */
  videoUrl?: string
  /** Logo sobreposta no canto inferior direito */
  logoUrl?: string
  /** Exibe o card em tamanho fixo (1020x518 no desktop, 358x407 no mobile) em vez da faixa larga padrão */
  compact?: boolean
}
