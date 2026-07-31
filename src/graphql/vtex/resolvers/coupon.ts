import storeConfig from '../../../../discovery.config'

interface CheckoutTotalizer {
  id?: string
  value?: number
}

interface CheckoutOrderFormResponse {
  value?: number
  marketingData?: { coupon?: string | null } | null
  totalizers?: CheckoutTotalizer[]
  messages?: Array<{ text?: string; status?: string }>
}

interface CouponResolverContext {
  headers: Record<string, string>
}

const getSalesChannel = (): string => {
  try {
    return String(JSON.parse(storeConfig.session.channel).salesChannel ?? 1)
  } catch {
    return '1'
  }
}

const couponResolver = {
  Mutation: {
    // O endpoint de `marketingData` só grava o código do cupom — quem
    // recalcula os preços dos itens (sellingPrice) é o endpoint dedicado de
    // cupons da Checkout API, o mesmo que o checkout web usa.
    applyCoupon: async (
      _: unknown,
      { orderFormId, coupon }: { orderFormId: string; coupon: string },
      ctx: CouponResolverContext
    ) => {
      const base = `https://${storeConfig.api.storeId}.${storeConfig.api.environment}.com.br`
      const sc = getSalesChannel()
      const cookie = ctx.headers?.cookie ?? ''
      const host = ctx.headers?.host ?? ''

      const response = await fetch(
        `${base}/api/checkout/pub/orderForm/${orderFormId}/coupons?sc=${sc}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(cookie ? { Cookie: cookie } : {}),
            ...(host ? { 'X-FORWARDED-HOST': host } : {}),
          },
          body: JSON.stringify({ text: coupon }),
        }
      )

      const orderForm: CheckoutOrderFormResponse = await response.json()

      if (!response.ok) {
        throw new Error(
          orderForm?.messages?.[0]?.text ?? 'Não foi possível aplicar o cupom.'
        )
      }

      const discountsTotalizer = orderForm.totalizers?.find(
        (totalizer) => totalizer.id === 'Discounts'
      )

      return {
        coupon: orderForm.marketingData?.coupon || null,
        discount: Math.abs(discountsTotalizer?.value ?? 0) / 100,
        total: (orderForm.value ?? 0) / 100,
      }
    },
  },
}

export default couponResolver
