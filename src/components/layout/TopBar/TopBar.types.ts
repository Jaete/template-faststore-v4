export interface TopBarLink {
  /** Texto exibido no link */
  label: string
  /** URL de destino do link */
  href: string
}

export interface TopBarProps {
  /** Textos exibidos no carrossel de benefícios */
  benefits: string[]
  /** Links institucionais exibidos à direita (máx. 3) */
  links?: TopBarLink[]
}
