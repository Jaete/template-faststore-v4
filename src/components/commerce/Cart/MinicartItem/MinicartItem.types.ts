import type { CartItem } from 'src/sdk/cart'

export interface MinicartItemProps {
  /** Item do carrinho, no shape do SDK do core. */
  item: CartItem
  /** Desabilita todas as interações do item (ex: enquanto o carrinho revalida). */
  disabled?: boolean
}
