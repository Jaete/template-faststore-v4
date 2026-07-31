export interface BannerProps {
  /** Texto exibido sobre a imagem (nome da linha/categoria) */
  label: string
  /** URL de destino ao clicar no banner */
  href: string
  /** URL da imagem de fundo do banner */
  imageSrc: string
  /** Texto alternativo da imagem — quando omitido, a imagem é decorativa */
  imageAlt?: string
}
