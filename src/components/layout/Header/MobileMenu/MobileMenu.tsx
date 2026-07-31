import { useEffect, useRef } from 'react'
import type { ComponentType } from 'react'

import Drawer from '../../../ui/Drawer/Drawer'
import IconButton from '../../../ui/IconButton/IconButton'
import Logo from '../../../ui/Logo/Logo'
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  LinkedInIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
  PinterestIcon,
} from '../../../ui/Icons'
import type { IconProps } from '../../../ui/Icons'
import { dispatch, EventName } from '../../../../utils/events'
import type {
  FooterLink,
  NavigationNode,
  SocialLink,
  SocialNetwork,
} from '../Header.types'
import { useMobileMenu } from './useMobileMenu'
import type { MobileMenuProps } from './MobileMenu.types'
import styles from './MobileMenu.module.scss'

const SOCIAL_ICONS: Record<SocialNetwork, ComponentType<IconProps>> = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
  pinterest: PinterestIcon,
}

const SOCIAL_LABELS: Record<SocialNetwork, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  pinterest: 'Pinterest',
}

function SocialBar({ links }: { links: SocialLink[] }) {
  return (
    <div className={styles.socialBar}>
      {links.map(({ network, url }) => {
        const Icon = SOCIAL_ICONS[network]

        // Rede desconhecida vinda do CMS (schema desatualizado): ignora
        if (!Icon) {
          return null
        }

        return (
          <a
            key={`${network}-${url}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={SOCIAL_LABELS[network]}
            className={styles.socialBar__link}
          >
            <Icon className={styles.socialBar__icon} />
          </a>
        )
      })}
    </div>
  )
}

/** Fecha o drawer ao navegar por um link folha */
function closeMenu() {
  dispatch(EventName.CloseMobileMenu)
}

/** Lista de links institucionais (Atendimento, Simuladores, etc.) */
function FooterLinks({ links }: { links: FooterLink[] }) {
  return (
    <ul className={styles.footerLinks}>
      {links.map(({ label, href }) => (
        <li key={label}>
          <a
            href={href}
            className={styles.footerLinks__link}
            onClick={closeMenu}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  )
}

/**
 * Linha do menu: nós com filhos viram botão que empilha um novo painel;
 * nós sem filhos são links diretos. O chevron é sempre renderizado (com
 * opacity 0 nas folhas) para o alinhamento das linhas não variar.
 */
function MenuRow({
  label,
  href,
  childItems,
  topLevel,
  onDrill,
}: {
  label: string
  href: string
  childItems?: NavigationNode[]
  topLevel?: boolean
  onDrill: (label: string, href: string, items: NavigationNode[]) => void
}) {
  const rowClassName = [
    styles.mobileMenu__row,
    !topLevel && styles['mobileMenu__row--child'],
  ]
    .filter(Boolean)
    .join(' ')

  const chevron = (
    <ChevronRightIcon
      className={[
        styles.mobileMenu__chevron,
        !childItems?.length && styles['mobileMenu__chevron--hidden'],
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )

  if (childItems?.length) {
    return (
      <button
        type="button"
        className={rowClassName}
        onClick={() => onDrill(label, href, childItems)}
      >
        <span>{label}</span>
        {chevron}
      </button>
    )
  }

  return (
    <a href={href} className={rowClassName} onClick={closeMenu}>
      <span>{label}</span>
      {chevron}
    </a>
  )
}

/**
 * Menu de navegação mobile: um único Drawer com painéis empilhados por cima
 * conforme o usuário avança em departamentos → categorias → subcategorias.
 *
 * Consome a mesma árvore `navigation` do mega menu desktop (configurada uma
 * única vez no CMS) — entram no drawer apenas os itens com `showOnMobile`.
 */
function MobileMenu({
  logo,
  navigation,
  socialLinks,
  footerLinks,
}: MobileMenuProps) {
  const { stack, isClosingTop, push, pop, reset } = useMobileMenu()

  const mobileItems = navigation.filter((item) => item.showOnMobile)

  const hasFooterLinks = Boolean(footerLinks?.length)
  const hasSocialLinks = Boolean(socialLinks?.length)

  // Ao empilhar/desempilhar um painel, move o foco para o botão de voltar do
  // painel do topo — leitores de tela e teclado seguem o nível ativo.
  const backButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (stack.length > 0) {
      backButtonRef.current?.focus()
    }
  }, [stack.length])

  return (
    <Drawer
      openEventName={EventName.OpenMobileMenu}
      closeEventName={EventName.CloseMobileMenu}
      title={logo ? <Logo {...logo} /> : null}
      closeAriaLabel="Fechar menu"
      onClose={reset}
      footer={
        hasFooterLinks || hasSocialLinks ? (
          <div className={styles.mobileMenuFooter}>
            {hasFooterLinks && (
              <FooterLinks links={footerLinks as FooterLink[]} />
            )}
            {hasSocialLinks && (
              <SocialBar links={socialLinks as SocialLink[]} />
            )}
          </div>
        ) : undefined
      }
    >
      <nav aria-label="Menu de navegação" className={styles.mobileMenu}>
        {/* Painel raiz: itens de nível 1 marcados para o mobile, no fluxo
            normal do body do Drawer (rola com ele) */}
        <ul
          className={styles.mobileMenu__list}
          // Coberto por um subpainel, fica inerte para foco/leitores de tela
          aria-hidden={stack.length > 0}
        >
          {mobileItems.map((item) => (
            <li key={item.label}>
              <MenuRow
                label={item.label}
                href={item.href}
                childItems={item.departments}
                topLevel
                onDrill={push}
              />
            </li>
          ))}
        </ul>

        {/* Painéis do drill-down, empilhados na ordem de navegação. Cada um
            cobre o drawer inteiro (inclusive o header com logo) e traz o
            próprio header: seta ← fecha só o painel atual, X fecha tudo */}
        {stack.map((level, index) => {
          const isTop = index === stack.length - 1
          const isClosing = isTop && isClosingTop

          const panelClassName = [
            styles.mobileMenu__panel,
            isClosing && styles['mobileMenu__panel--closing'],
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div
              key={`${index}-${level.label}`}
              className={panelClassName}
              // Painéis cobertos ficam inertes para foco/leitores de tela
              aria-hidden={!isTop}
            >
              <header className={styles.mobileMenu__panelHeader}>
                <button
                  type="button"
                  ref={isTop ? backButtonRef : undefined}
                  className={styles.mobileMenu__back}
                  onClick={pop}
                  disabled={isClosing}
                  aria-label="Voltar"
                >
                  <ArrowLeftIcon className={styles.mobileMenu__backIcon} />
                </button>

                <IconButton ariaLabel="Fechar menu" onClick={closeMenu}>
                  <CloseIcon className={styles.mobileMenu__closeIcon} />
                </IconButton>
              </header>

              <div className={styles.mobileMenu__panelBody}>
                <div className={styles.mobileMenu__titleRow}>
                  <span className={styles.mobileMenu__title}>
                    {level.label}
                  </span>

                  <a
                    href={level.href}
                    className={styles.mobileMenu__seeAll}
                    onClick={closeMenu}
                  >
                    Ver tudo
                  </a>
                </div>

                <ul className={styles.mobileMenu__list}>
                  {level.items.map((node) => (
                    <li key={node.label}>
                      <MenuRow
                        label={node.label}
                        href={node.href}
                        childItems={node.categories}
                        onDrill={push}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </nav>
    </Drawer>
  )
}

export default MobileMenu
