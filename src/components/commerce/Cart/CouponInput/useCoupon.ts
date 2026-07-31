import { useCallback, useState } from 'react'
import { gql } from '@faststore/core/api'
import { useLazyQuery_unstable as useLazyQuery } from '@faststore/core/experimental'
import { useCart } from 'src/sdk/cart'

interface CouponResult {
  coupon: string | null
  discount: number
  total: number
}

interface ApplyCouponData {
  applyCoupon: CouponResult
}

interface ApplyCouponVariables {
  orderFormId: string
  coupon: string
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- @ts-ignore é intencional aqui
// @ts-ignore
const ApplyCouponMutation = gql(`
  mutation ApplyCoupon($orderFormId: String!, $coupon: String!) {
    applyCoupon(orderFormId: $orderFormId, coupon: $coupon) {
      coupon
      discount
      total
    }
  }
`)

/**
 * Aplica/remove cupom de desconto via a mutation customizada `applyCoupon`
 * (src/graphql/vtex), que usa o endpoint de cupons da Checkout API — o mesmo
 * que o checkout web usa, e que recalcula os preços dos itens (ao contrário
 * do `marketingData`, que só grava o código do cupom). A mutation já
 * retorna `discount`/`total` recalculados, então não é preciso revalidar o
 * cartStore local (isso só adicionava uma segunda chamada lenta e não
 * refletia o desconto). O `id` do carrinho do FastStore é o próprio
 * `orderFormId` — só existe após a primeira validação do carrinho, por isso
 * o guard antes das chamadas.
 */
export function useCoupon() {
  const { id } = useCart()
  const [executeApplyCoupon] = useLazyQuery<
    ApplyCouponData,
    ApplyCouponVariables
  >(ApplyCouponMutation, { orderFormId: '', coupon: '' })

  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [discount, setDiscount] = useState(0)
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const postCoupon = useCallback(
    async (code: string) => {
      const data = await executeApplyCoupon({ orderFormId: id, coupon: code })

      return data?.applyCoupon ?? null
    },
    [executeApplyCoupon, id]
  )

  const applyCoupon = useCallback(async () => {
    const code = coupon.trim()

    if (!code || !id || loading) {
      return
    }

    setLoading(true)
    setError(false)

    try {
      const result = await postCoupon(code)

      if (
        result?.coupon &&
        result.coupon.toUpperCase() === code.toUpperCase()
      ) {
        setAppliedCoupon(result.coupon)
        setDiscount(result.discount)
        setTotal(result.total)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [coupon, id, loading, postCoupon])

  const removeCoupon = useCallback(async () => {
    if (!id || loading) {
      return
    }

    setLoading(true)

    try {
      const result = await postCoupon('')

      setAppliedCoupon(null)
      setCoupon('')
      setDiscount(0)
      setTotal(result?.total ?? null)
    } catch {
      // Mantém o cupom aplicado se a remoção falhar
    } finally {
      setLoading(false)
    }
  }, [id, loading, postCoupon])

  const changeCoupon = useCallback((value: string) => {
    setCoupon(value)
    setError(false)
  }, [])

  return {
    coupon,
    appliedCoupon,
    discount,
    total,
    loading,
    error,
    changeCoupon,
    applyCoupon,
    removeCoupon,
  }
}
