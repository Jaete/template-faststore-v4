import type { KeyboardEvent } from 'react'

import MegaMenu from '../MegaMenu/MegaMenu'
import type {
  HeaderMegaMenuConfig,
  HeaderNavigationItem,
} from '../Header.types'
import { useNavigation } from './useNavigation'
import styles from './Navigation.module.scss'

const MEGA_MENU_ID = 'header-mega-menu'

interface NavigationProps {
  items: HeaderNavigationItem[]
  /** Comportamento do painel do mega menu (repassado do Header) */
  megaMenu?: HeaderMegaMenuConfig
}

function Navigation({ items, megaMenu }: NavigationProps) {
  const {
    activeIndex,
    isClosing,
    openMenu,
    scheduleClose,
    cancelScheduledClose,
    closeMenu,
    finishClosing,
  } = useNavigation()

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      closeMenu()
    }
  }

  const activeItem = activeIndex !== null ? items[activeIndex] : null

  return (
    <nav
      className={styles.nav}
      aria-label="Navegação principal"
      onKeyDown={handleKeyDown}
    >
      <ul className={styles.navList}>
        {items.map((item, index) => {
          const hasMegaMenu = Boolean(
            item.departments?.length || item.banners?.length
          )
          const isActive = hasMegaMenu && activeIndex === index && !isClosing
          const linkClassName = isActive
            ? `${styles.navLink} ${styles['navLink--active']}`
            : styles.navLink

          return (
            <li key={item.href}>
              <a
                href={item.href}
                className={linkClassName}
                onMouseEnter={hasMegaMenu ? () => openMenu(index) : undefined}
                onMouseLeave={hasMegaMenu ? scheduleClose : undefined}
                onFocus={hasMegaMenu ? () => openMenu(index) : undefined}
                aria-haspopup={hasMegaMenu || undefined}
                aria-expanded={hasMegaMenu ? isActive : undefined}
                aria-controls={hasMegaMenu ? MEGA_MENU_ID : undefined}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>

      {activeItem?.departments?.length || activeItem?.banners?.length ? (
        <div
          id={MEGA_MENU_ID}
          className={
            isClosing
              ? `${styles.megaMenu} ${styles['megaMenu--closing']}`
              : styles.megaMenu
          }
          onMouseEnter={cancelScheduledClose}
          onMouseLeave={scheduleClose}
          onAnimationEnd={(event) => {
            // Fim da animação de saída do próprio painel → desmonta.
            // O guard de target ignora animações de filhos (bubbling).
            if (isClosing && event.target === event.currentTarget) {
              finishClosing()
            }
          }}
        >
          {/* key reseta o departamento ativo ao trocar de item da nav */}
          <MegaMenu key={activeItem.href} item={activeItem} config={megaMenu} />
        </div>
      ) : null}
    </nav>
  )
}

export default Navigation
