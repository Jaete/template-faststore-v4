import type {
  FooterLink,
  HeaderLogo,
  HeaderNavigationItem,
  NavigationNode,
  SocialLink,
} from '../Header.types'

export interface MobileMenuProps {
  /** Logo exibido no topo do drawer (mesmo do header) */
  logo?: HeaderLogo
  /**
   * Mesma árvore de navegação do desktop — o drawer lista apenas os itens
   * com `showOnMobile` marcado no CMS.
   */
  navigation: HeaderNavigationItem[]
  /** Redes sociais do rodapé — sem itens, o rodapé não é renderizado */
  socialLinks?: SocialLink[]
  /** Links institucionais do rodapé (Atendimento, Simuladores, etc.) */
  footerLinks?: FooterLink[]
}

/**
 * Um nível empilhado do drill-down: o painel exibe `items` sob o título
 * `label` (nó que o abriu), e `href` alimenta o link "Ver tudo" do nível.
 */
export interface MenuLevel {
  label: string
  href: string
  items: NavigationNode[]
}
