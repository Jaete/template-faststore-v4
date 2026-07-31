import { useMemo } from 'react'

import { usePriceFormatter } from 'src/sdk/product/useFormattedPrice'
import { useDiscountPercent } from 'src/sdk/product/useDiscountPercent'

import type { ProductDetailsData, ProductInstallment } from './Details.types'

/** Nome da propriedade que carrega o código de referência (RefId) na VTEX. */
const REFERENCE_PROPERTY_NAME = 'RefId'

interface UseProductDetailsParams {
  product: ProductDetailsData
  /**
   * Percentual de desconto no PIX vindo do CMS (ex.: 2 = 2%). A promoção de PIX
   * da VTEX só é aplicada no checkout, então o valor não vem no catálogo — é
   * calculado aqui sobre o preço à vista.
   */
  pixDiscountPercent?: number
}

/** Parcelamento resolvido para exibição ("Nx de R$Y sem juros"). */
export interface InstallmentInfo {
  number: number
  formattedValue: string
}

/** Linha de parcela para a lista do modal "ver parcelas". */
export interface InstallmentRow {
  number: number
  formattedValue: string
  /** `true` quando a opção é sem juros. */
  interestFree: boolean
}

interface UseProductDetailsReturn {
  name: string
  /** Código de referência (RefId) ou `undefined` se o catálogo não expõe. */
  referenceCode?: string
  formattedListPrice: string
  formattedSellingPrice: string
  hasDiscount: boolean
  /** Rótulo da flag de desconto, ex.: "-10%". */
  discountLabel: string
  /** Preço no PIX formatado — só definido quando é menor que o à vista. */
  pixPrice?: string
  /** Melhor opção de parcelamento sem juros (inline), se houver. */
  installment?: InstallmentInfo
  /** Todas as parcelas (com mais de 1x) para o modal "ver parcelas". */
  installmentRows: InstallmentRow[]
}

/**
 * Deriva o view-model da coluna de informações a partir do produto do contexto
 * da PDP: título, referência, preços formatados, desconto, PIX e parcelamento.
 *
 * Preços: `offers.offers[0].listPrice` é o preço "de" (riscado) e
 * `offers.offers[0].price` é o preço à vista (reflete promoções de utm_source).
 */
export function useProductDetails({
  product,
  pixDiscountPercent,
}: UseProductDetailsParams): UseProductDetailsReturn {
  const formatPrice = usePriceFormatter({ decimals: true })

  const firstOffer = product.offers.offers[0]
  const listPrice = firstOffer?.listPrice ?? 0
  const sellingPrice = firstOffer?.price ?? product.offers.lowPrice

  const formattedListPrice = useMemo(
    () => formatPrice(listPrice),
    [formatPrice, listPrice]
  )
  const formattedSellingPrice = useMemo(
    () => formatPrice(sellingPrice),
    [formatPrice, sellingPrice]
  )
  const discountPercent = useDiscountPercent(listPrice, sellingPrice)

  const hasDiscount = sellingPrice < listPrice

  const referenceCode = useMemo(() => {
    const property = product.additionalProperty?.find(
      (item) => item.name === REFERENCE_PROPERTY_NAME
    )

    return typeof property?.value === 'string' ? property.value : undefined
  }, [product.additionalProperty])

  const pixPrice = useMemo(
    () =>
      pixDiscountPercent && pixDiscountPercent > 0
        ? formatPrice(sellingPrice * (1 - pixDiscountPercent / 100))
        : undefined,
    [pixDiscountPercent, formatPrice, sellingPrice]
  )

  const installment = useBestInterestFreeInstallment(
    product.availableInstallments,
    formatPrice
  )

  const installmentRows = useInstallmentRows(
    product.availableInstallments,
    formatPrice
  )

  return {
    name: product.name,
    referenceCode,
    formattedListPrice,
    formattedSellingPrice,
    hasDiscount,
    discountLabel: `-${discountPercent}%`,
    pixPrice,
    installment,
    installmentRows,
  }
}

/**
 * Escolhe o parcelamento sem juros com o maior número de parcelas e formata o
 * valor. Retorna `undefined` quando não há opção sem juros (2x+).
 */
function useBestInterestFreeInstallment(
  installments: ProductInstallment[] | undefined,
  formatPrice: (price: number) => string
): InstallmentInfo | undefined {
  const best = useMemo(() => {
    const interestFree = (installments ?? []).filter(
      (item) => item.installmentInterest === 0 && item.installmentNumber > 1
    )

    if (!interestFree.length) {
      return undefined
    }

    return interestFree.reduce((max, item) =>
      item.installmentNumber > max.installmentNumber ? item : max
    )
  }, [installments])

  if (!best) {
    return undefined
  }

  return {
    number: best.installmentNumber,
    formattedValue: formatPrice(best.installmentValue),
  }
}

/**
 * Lista de parcelas (2x+) ordenada por número, para o modal "ver parcelas".
 * Deduplica por número de parcelas, preferindo a opção sem juros.
 */
function useInstallmentRows(
  installments: ProductInstallment[] | undefined,
  formatPrice: (price: number) => string
): InstallmentRow[] {
  return useMemo(() => {
    const byNumber = new Map<number, ProductInstallment>()

    for (const item of installments ?? []) {
      if (item.installmentNumber <= 1) {
        continue
      }

      const current = byNumber.get(item.installmentNumber)

      if (!current || item.installmentInterest < current.installmentInterest) {
        byNumber.set(item.installmentNumber, item)
      }
    }

    return Array.from(byNumber.values())
      .sort((a, b) => a.installmentNumber - b.installmentNumber)
      .map((item) => ({
        number: item.installmentNumber,
        formattedValue: formatPrice(item.installmentValue),
        interestFree: item.installmentInterest === 0,
      }))
  }, [installments, formatPrice])
}
