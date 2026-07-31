import { cartStore } from 'src/sdk/cart'
import { useRemoveButton } from 'src/sdk/cart/useRemoveButton'
import { usePriceFormatter } from 'src/sdk/product/useFormattedPrice'

import IconButton from '../../../ui/IconButton/IconButton'
import { TrashIcon } from '../../../ui/Icons'
import QuantitySelector from '../../QuantitySelector/QuantitySelector'
import type { MinicartItemProps } from './MinicartItem.types'
import styles from './MinicartItem.module.scss'

function MinicartItem({ item, disabled = false }: MinicartItemProps) {
  const removeButton = useRemoveButton(item)
  const formatPrice = usePriceFormatter({ decimals: true })

  const [image] = item.itemOffered.image
  const hasDiscount = item.price < item.listPrice

  return (
    <div className={styles.minicartItem}>
      {image && (
        <img
          className={styles.minicartItem__image}
          src={image.url}
          alt={image.alternateName || item.itemOffered.name}
        />
      )}

      <div className={styles.minicartItem__info}>
        <div className={styles.minicartItem__nameRow}>
          <span className={styles.minicartItem__name}>
            {item.itemOffered.name}
          </span>

          <IconButton
            ariaLabel="Remover produto"
            disabled={disabled}
            onClick={removeButton.onClick}
          >
            <TrashIcon className={styles.minicartItem__trashIcon} />
          </IconButton>
        </div>

        <div className={styles.minicartItem__prices}>
          {hasDiscount && (
            <>
              <span className={styles.minicartItem__listPrice}>
                {formatPrice(item.listPrice)}
              </span>
              <span
                className={styles.minicartItem__priceDivider}
                aria-hidden="true"
              >
                |
              </span>
            </>
          )}
          <span className={styles.minicartItem__price}>
            {formatPrice(item.price)}
          </span>
        </div>

        <div className={styles.minicartItem__actions}>
          <QuantitySelector
            className={styles.minicartItem__quantitySelector}
            quantity={item.quantity}
            disabled={disabled}
            onChange={(quantity) =>
              cartStore.updateItemQuantity(item.id, quantity)
            }
          />
        </div>
      </div>
    </div>
  )
}

export default MinicartItem
