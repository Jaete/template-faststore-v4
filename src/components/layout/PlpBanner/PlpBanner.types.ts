export interface PlpBannerImage {
  src: string
  alt?: string
}

/** Variante de exibição do banner. */
export type PlpBannerVariant = 'image' | 'titleOnly'

export interface PlpBannerProps {
  /**
   * Variante de exibição: `"image"` (padrão) mostra a imagem de fundo com o
   * título sobreposto; `"titleOnly"` exibe apenas o título centralizado, sem
   * imagem.
   */
  variant?: PlpBannerVariant
  /** Título exibido sobre o banner */
  title?: string
  /**
   * Quando `true`, usa o nome da categoria atual da PLP como título (exibido
   * capitalizado), ignorando o campo `title`. Se não houver categoria (fora de
   * uma PLP), cai de volta no `title`.
   */
  useCategoryName?: boolean
  /**
   * Imagem de fundo do banner — já deve conter todo o tratamento visual
   * (escurecimento, composição) necessário para o título ficar legível
   */
  image?: PlpBannerImage
  /**
   * Imagem de fundo específica para mobile. Quando preenchida, é exibida
   * apenas no mobile (substituindo a imagem desktop); no desktop continua
   * valendo `image`. Se vazia, `image` é usada em todos os dispositivos.
   */
  mobileImage?: PlpBannerImage
}
