import { useState } from 'react'

import { useCheckoutButton } from 'src/sdk/cart/useCheckoutButton'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'

import Button from '../../../ui/Button/Button'
import CouponInput from '../CouponInput/CouponInput'
import { dispatch, EventName } from '../../../../utils/events'
import type { CouponResult } from '../CouponInput/CouponInput.types'
import type { MinicartFooterProps } from './MinicartFooter.types'
import styles from './MinicartFooter.module.scss'

function MinicartFooter({
  subtotal,
  discount,
  total,
  isValidating = false,
  coupon,
  subtotalLabel = 'Subtotal',
  discountLabel = 'Descontos',
  totalLabel = 'Total',
  shippingNote = 'Frete e descontos serão calculados no checkout',
  checkoutButtonLabel = 'Finalizar compra',
  continueButtonLabel = 'Continuar comprando',
}: MinicartFooterProps) {
  const checkoutButton = useCheckoutButton()

  // O cupom é aplicado direto no orderForm (VTEX) e recalculado ali mesmo —
  // os totais vindos do `useMinicart`/cartStore local não refletem esse
  // desconto até uma revalidação do carrinho (ex.: outro add-to-cart). Por
  // isso a mutation de cupom já retorna `discount`/`total` recalculados, e
  // usamos esse resultado para sobrescrever a exibição enquanto o cupom
  // estiver aplicado.
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null)
  const effectiveDiscount = couponResult?.discount ?? discount
  const effectiveTotal = couponResult?.total ?? total

  const formattedSubtotal = useFormattedPrice(subtotal)
  const formattedDiscount = useFormattedPrice(-effectiveDiscount)
  const formattedTotal = useFormattedPrice(effectiveTotal)
  const hasDiscount = effectiveDiscount > 0

  return (
    <footer className={styles.minicartFooter}>
      {coupon?.enabled !== false && (
        <CouponInput
          {...coupon}
          disabled={isValidating}
          onCouponApplied={setCouponResult}
        />
      )}

      <div
        className={styles.minicartFooter__prices}
        data-has-discount={hasDiscount}
      >
        <div
          className={styles.minicartFooter__subtotal}
          aria-hidden={!hasDiscount}
          data-visible={hasDiscount}
        >
          <div className={styles.minicartFooter__rowContent}>
            <span>{subtotalLabel}</span>
            <span>{formattedSubtotal}</span>
          </div>
        </div>

        <div
          className={styles.minicartFooter__discount}
          aria-hidden={!hasDiscount}
          data-visible={hasDiscount}
        >
          <div className={styles.minicartFooter__rowContent}>
            <span>{discountLabel}</span>
            <span>{formattedDiscount}</span>
          </div>
        </div>

        <div className={styles.minicartFooter__divider} />

        <div className={styles.minicartFooter__total}>
          <span>{totalLabel}</span>
          <span>{formattedTotal}</span>
        </div>
      </div>

      <p className={styles.minicartFooter__shippingNote}>{shippingNote}</p>

      <div className={styles.minicartFooter__buttons}>
        <Button
          label={checkoutButtonLabel}
          variant="secondary"
          loading={isValidating}
          disabled={checkoutButton.disabled}
          onClick={checkoutButton.onClick}
        />
        <Button
          label={continueButtonLabel}
          variant="tertiary"
          onClick={() => dispatch(EventName.CloseCartDrawer)}
        />
      </div>
    </footer>
  )
}

export default MinicartFooter
