import IconButton from '../../ui/IconButton/IconButton'
import { MinusIcon, PlusIcon } from '../../ui/Icons'
import type { QuantitySelectorProps } from './QuantitySelector.types'
import styles from './QuantitySelector.module.scss'

function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max,
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const canDecrease = !disabled && quantity > min
  const canIncrease = !disabled && (max === undefined || quantity < max)

  return (
    <div
      className={[styles.quantitySelector, className].filter(Boolean).join(' ')}
    >
      <IconButton
        ariaLabel="Diminuir quantidade"
        disabled={!canDecrease}
        onClick={() => onChange(quantity - 1)}
      >
        <MinusIcon className={styles.quantitySelector__icon} />
      </IconButton>

      <span className={styles.quantitySelector__quantity}>{quantity}</span>

      <IconButton
        ariaLabel="Aumentar quantidade"
        disabled={!canIncrease}
        onClick={() => onChange(quantity + 1)}
      >
        <PlusIcon className={styles.quantitySelector__icon} />
      </IconButton>
    </div>
  )
}

export default QuantitySelector
