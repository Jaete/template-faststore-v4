import type { LogoProps } from '../../ui/Logo/Logo.types'
import type { BannerProps as NavigationBannerProps } from './Navigation/Banner/Banner.types'

/** Config do logo vinda do CMS — mesmo contrato do átomo Logo */
export type HeaderLogo = LogoProps

/**
 * Nó recursivo da árvore de navegação do mega menu.
 * Cada nível carrega o próprio conteúdo, exibido quando o nó é ativado:
 * uma nova árvore de categorias OU banners (categorias têm precedência
 * quando ambos existirem). Sem conteúdo, o nó é um link direto.
 *
 * Departamento → categorias OU banners
 * Categoria    → subcategorias OU banners
 * Subcategoria → apenas banners
 */
export interface NavigationNode {
  /** Texto exibido no link */
  label: string
  /** URL de destino ao clicar diretamente no nó */
  href: string
  /** Próximo nível da árvore (categorias/subcategorias) */
  categories?: NavigationNode[]
  /** Banners exibidos como conteúdo do nó (máx. 3) */
  banners?: NavigationBannerProps[]
}

export interface HeaderNavigationItem {
  /** Texto exibido no link de navegação */
  label: string
  /** URL de destino do link */
  href: string
  /**
   * Departamentos listados na coluna esquerda do mega menu (nível 1).
   * O item expande o painel no hover quando tem departamentos OU banners;
   * sem ambos, é um link direto.
   */
  departments?: NavigationNode[]
  /**
   * Conteúdo padrão do painel (nível 0): banners exibidos enquanto nenhum
   * departamento está em hover (máx. 3). Sem departamentos, ocupam o
   * painel inteiro.
   */
  banners?: NavigationBannerProps[]
  /**
   * Exibe o item também no menu mobile (opt-in). Com departamentos, o item
   * abre o drill-down empilhado; sem, é um link direto. Banners são
   * ignorados no mobile.
   */
  showOnMobile?: boolean
}

/** Redes sociais suportadas no rodapé do menu mobile */
export type SocialNetwork =
  'linkedin' | 'instagram' | 'tiktok' | 'youtube' | 'pinterest'

/** Link de rede social exibido no rodapé do menu mobile */
export interface SocialLink {
  network: SocialNetwork
  url: string
}

/**
 * Link institucional exibido no rodapé do menu mobile (ex.: Atendimento,
 * Simuladores, Lojas) — acima dos ícones de redes sociais.
 */
export interface FooterLink {
  label: string
  href: string
}

/** Visibilidade dos botões de ação à direita do header */
export interface HeaderActionsConfig {
  /** Exibe o botão de busca */
  showSearch?: boolean
  /** Exibe o botão de conta */
  showAccount?: boolean
  /** Exibe o botão de lista de desejos */
  showWishlist?: boolean
  /** Exibe o botão do carrinho */
  showCart?: boolean
}

/** Comportamento do painel do mega menu */
export interface HeaderMegaMenuConfig {
  /** Exibe o link "Ver tudo" ao fim das listas de categorias */
  showSeeAll?: boolean
  /** Texto do link "Ver tudo" */
  seeAllLabel?: string
}

export interface HeaderProps {
  /** Logo exibido à esquerda do header — sem ele, nada é renderizado */
  logo?: HeaderLogo
  /**
   * Itens da navegação principal (desktop), preenchidos no CMS.
   * Opcional: sem itens o header renderiza só logo e ações.
   */
  navigation?: HeaderNavigationItem[]
  /**
   * Sobrepõe o banner full-bleed do topo da página: o header começa
   * transparente (com overlay em gradiente) e fica sólido no hover/foco e
   * sempre que a página sai do topo. Desmarcado, é sólido o tempo todo.
   *
   * Só tem efeito na home (`/`), onde existe o banner full-bleed — em
   * qualquer outra rota o header é sempre sólido, mesmo com a opção marcada.
   */
  overlayBanner?: boolean
  /** Visibilidade dos botões de ação (todos visíveis por padrão) */
  actions?: HeaderActionsConfig
  /** Comportamento do painel do mega menu */
  megaMenu?: HeaderMegaMenuConfig
  /** Redes sociais exibidas no rodapé do menu mobile */
  socialLinks?: SocialLink[]
  /** Links institucionais do rodapé do menu mobile (Atendimento, Simuladores, etc.) */
  footerLinks?: FooterLink[]
}
