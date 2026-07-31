import { useEffect } from 'react'

import Input from '../../../ui/Input/Input'
import { useCoupon } from './useCoupon'
import type { CouponInputProps } from './CouponInput.types'
import styles from './CouponInput.module.scss'

function CouponInput({
  placeholder = 'Adicionar cupom de desconto',
  applyLabel = 'Aplicar',
  removeLabel = 'Remover',
  successMessage = 'Cupom aplicado com sucesso!',
  errorMessage = 'Cupom inválido',
  onCouponApplied,
  disabled = false,
}: CouponInputProps) {
  const {
    coupon,
    appliedCoupon,
    discount,
    total,
    loading,
    error,
    changeCoupon,
    applyCoupon,
    removeCoupon,
  } = useCoupon()

  useEffect(() => {
    onCouponApplied?.(
      appliedCoupon && total !== null ? { discount, total } : null
    )
  }, [appliedCoupon, discount, total, onCouponApplied])

  const isApplied = appliedCoupon !== null

  return (
    <div className={styles.couponInput}>
      <Input
        value={isApplied ? appliedCoupon : coupon}
        onChange={(event) => changeCoupon(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !isApplied) {
            event.preventDefault()
            applyCoupon()
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={isApplied}
        aria-label={placeholder}
        success={isApplied}
        successMessage={successMessage}
        error={error}
        errorMessage={errorMessage}
        messageVariant="compact"
      >
        <button
          type="button"
          className={styles.couponInput__action}
          onClick={isApplied ? removeCoupon : applyCoupon}
          disabled={loading || disabled}
        >
          {isApplied ? removeLabel : applyLabel}
        </button>
      </Input>
    </div>
  )
}

export default CouponInput
