export interface SeoTextProps {
  /** Título exibido no topo da seção */
  title: string
  /** Texto descritivo (conteúdo de SEO) */
  description: string
  /** Rótulo do link (ex.: "Ver mais") */
  linkLabel?: string
  /** Destino do link */
  linkHref?: string
}
