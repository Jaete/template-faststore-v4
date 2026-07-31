import IconButton from '../../../../ui/IconButton/IconButton'
import { WishlistIcon } from '../../../../ui/Icons'
import styles from './WishlistButton.module.scss'

/**
 * Botão de lista de desejos na coluna de informações da PDP. Nesta fase é
 * apenas visual — sem estado nem persistência (a lógica de wishlist entra em
 * fase posterior).
 */
function WishlistButton() {
  return (
    <IconButton ariaLabel="Adicionar à lista de desejos">
      <WishlistIcon className={styles.wishlistButton__icon} />
    </IconButton>
  )
}

export default WishlistButton
