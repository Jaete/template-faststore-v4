import Button from '../../../../ui/Button/Button'
import QuantitySelector from '../../../QuantitySelector/QuantitySelector'
import { useBuyBlock } from './useBuyBlock'
import type { BuyBlockProps } from './BuyBlock.types'
import styles from './BuyBlock.module.scss'

/**
 * Bloco de compra do SKU ativo. Exibido no lugar do `ProductUnavailable` quando `isAvailable` é
 * `true` — ver o switch em `Details.tsx`.
 */
function BuyBlock({ className }: BuyBlockProps) {
  const { quantity, setQuantity, maxQuantity, addToCart, disabled } =
    useBuyBlock()

  return (
    <div className={[styles.buyBlock, className].filter(Boolean).join(' ')}>
      <QuantitySelector
        quantity={quantity}
        onChange={setQuantity}
        max={maxQuantity}
        className={styles.buyBlock__quantitySelector}
      />

      <Button
        label="Adicionar ao carrinho"
        variant="primary"
        type="button"
        disabled={disabled}
        onClick={addToCart}
      />
    </div>
  )
}

export default BuyBlock
