import { dispatch, EventName } from '../../../../../utils/events'
import InstallmentsModal from '../InstallmentsModal/InstallmentsModal'
import type { InstallmentInfo, InstallmentRow } from '../useProductDetails'
import styles from './Price.module.scss'

interface PriceProps {
  formattedListPrice: string
  formattedSellingPrice: string
  hasDiscount: boolean
  discountLabel: string
  pixPrice?: string
  installment?: InstallmentInfo
  installmentRows: InstallmentRow[]
}

function Price({
  formattedListPrice,
  formattedSellingPrice,
  hasDiscount,
  discountLabel,
  pixPrice,
  installment,
  installmentRows,
}: PriceProps) {
  return (
    <div className={styles.price}>
      <div className={styles.price__line}>
        {hasDiscount && (
          <>
            <span className={styles.price__list}>{formattedListPrice}</span>
            <span className={styles.price__divider}>|</span>
          </>
        )}

        <span className={styles.price__selling}>{formattedSellingPrice}</span>

        {installment && (
          <span className={styles.price__installment}>
            ou {installment.number}x de {installment.formattedValue}
          </span>
        )}

        {installmentRows.length > 0 && (
          <button
            type="button"
            className={styles.price__seeInstallments}
            onClick={() => dispatch(EventName.OpenInstallmentsModal)}
          >
            ver parcelas
          </button>
        )}

        {hasDiscount && (
          <span className={styles.price__flag}>{discountLabel}</span>
        )}
      </div>

      {pixPrice && (
        <div className={styles.price__pix}>
          <span className={styles.price__pixLabel}>{pixPrice} no PIX</span>
        </div>
      )}

      <InstallmentsModal rows={installmentRows} />
    </div>
  )
}

export default Price
