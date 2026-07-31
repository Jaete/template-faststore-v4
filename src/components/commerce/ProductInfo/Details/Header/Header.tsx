import WishlistButton from '../WishlistButton/WishlistButton'
import ShareButton from '../ShareButton/ShareButton'
import styles from './Header.module.scss'

interface HeaderProps {
  name: string
  referenceCode?: string
}

/**
 * Topo da coluna de informações: nome do produto + código de referência (REF)
 * à esquerda; coluna de ações (wishlist + compartilhar) à direita.
 */
function Header({ name, referenceCode }: HeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.header__name}>
        <h1 className={styles.header__title}>{name}</h1>

        {referenceCode && (
          <p className={styles.header__reference}>REF: {referenceCode}</p>
        )}
      </div>

      <div className={styles.header__actions}>
        <WishlistButton />
        <ShareButton productName={name} />
      </div>
    </div>
  )
}

export default Header
