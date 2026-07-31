import { useRouter } from 'next/router'

import {
  SearchIcon,
  UserIcon,
  WishlistIcon,
  CartIcon,
  MenuIcon,
} from '../../ui/Icons'
import IconButton from '../../ui/IconButton/IconButton'
import Logo from '../../ui/Logo/Logo'
import Navigation from './Navigation/Navigation'
import MobileMenu from './MobileMenu/MobileMenu'
import { useHeader } from './useHeader'
import type { HeaderProps } from './Header.types'
import styles from './Header.module.scss'

function Header({
  logo,
  navigation,
  overlayBanner = true,
  actions,
  megaMenu,
  socialLinks,
  footerLinks,
}: HeaderProps) {
  const {
    showSearch = true,
    showAccount = true,
    showWishlist = true,
    showCart = true,
  } = actions ?? {}

  const { pathname } = useRouter()
  const isHome = pathname === '/'
  const overlay = overlayBanner && isHome

  const { isScrolled, openSearch, openCart, openMobileMenu, cartItemsCount } =
    useHeader(overlay)

  const hasMobileMenu = navigation?.some((item) => item.showOnMobile) ?? false

  const className = [
    styles.header,
    overlay ? styles['header--overlay'] : styles['header--solid'],
    overlay && isScrolled && styles['header--scrolled'],
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <header className={className}>
        {logo && <Logo {...logo} />}

        {navigation && navigation.length > 0 && (
          <Navigation items={navigation} megaMenu={megaMenu} />
        )}

        <div className={styles.header__actions}>
          {hasMobileMenu && (
            <div className={styles.header__menuButton}>
              <IconButton ariaLabel="Abrir menu" onClick={openMobileMenu}>
                <MenuIcon className={styles.header__actionIcon} />
              </IconButton>
            </div>
          )}

          {showSearch && (
            <IconButton ariaLabel="Abrir busca" onClick={openSearch}>
              <SearchIcon className={styles.header__actionIcon} />
            </IconButton>
          )}

          {showAccount && (
            <IconButton ariaLabel="Entrar na conta">
              <UserIcon className={styles.header__actionIcon} />
            </IconButton>
          )}

          {showWishlist && (
            <IconButton ariaLabel="Lista de desejos">
              <WishlistIcon className={styles.header__actionIcon} />
            </IconButton>
          )}

          {showCart && (
            <div className={styles.header__cartButton}>
              <IconButton ariaLabel="Abrir carrinho" onClick={openCart}>
                <CartIcon className={styles.header__actionIcon} />
              </IconButton>

              {cartItemsCount > 0 && (
                <span className={styles.header__cartBadge}>
                  {cartItemsCount}
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {hasMobileMenu && (
        <MobileMenu
          logo={logo}
          navigation={navigation ?? []}
          socialLinks={socialLinks}
          footerLinks={footerLinks}
        />
      )}
    </>
  )
}

export default Header
