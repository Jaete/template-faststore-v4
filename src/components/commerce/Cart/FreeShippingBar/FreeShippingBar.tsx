import { usePriceFormatter } from 'src/sdk/product/useFormattedPrice'

import type { FreeShippingBarProps } from './FreeShippingBar.types'
import styles from './FreeShippingBar.module.scss'

function FreeShippingBar({
  threshold,
  currentValue,
  pendingMessage = 'Faltam {remaining} para você ganhar Frete Grátis!',
  achievedMessage = 'Você ganhou Frete Grátis!',
}: FreeShippingBarProps) {
  const formatPrice = usePriceFormatter({ decimals: true })

  const remaining = Math.max(0, threshold - currentValue)
  const achieved = remaining === 0
  const progress = Math.min(100, (currentValue / threshold) * 100)

  const message = achieved
    ? achievedMessage
    : pendingMessage.replace('{remaining}', formatPrice(remaining))

  return (
    <div className={styles.freeShippingBar}>
      <p className={styles.freeShippingBar__message}>{message}</p>

      <div
        className={styles.freeShippingBar__track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label="Progresso para o frete grátis"
      >
        <div
          className={styles.freeShippingBar__progress}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default FreeShippingBar
