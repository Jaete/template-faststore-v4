/**
 * Tipos do slice do produto que a coluna de informações consome, mirrorando o
 * shape de `context.data.product` (via `usePDP`). Só os campos usados aqui.
 */

/** Propriedade adicional do produto (carrega o RefId, entre outras). */
export interface ProductAdditionalProperty {
  propertyID: string
  name: string
  value: unknown
  valueReference: unknown
}

/** Oferta individual de um seller. */
export interface ProductOffer {
  listPrice: number
  price: number
  availability: string
}

/** Bloco agregado de ofertas do produto. */
export interface ProductOffers {
  lowPrice: number
  offers: ProductOffer[]
}

/** Opção de parcelamento (resolver customizado `availableInstallments`). */
export interface ProductInstallment {
  installmentPaymentSystemName: string
  installmentValue: number
  installmentInterest: number
  installmentNumber: number
}

/**
 * Slice do produto consumido pela coluna de informações. Mínimo de propósito: o
 * `useProductDetails` recebe tanto o produto do `usePDP` quanto um SKU de
 * `allVariantProducts`, e ambos satisfazem este shape estruturalmente.
 *
 * `description` NÃO está aqui: a API a resolve do `isVariantOf`, então é do grupo
 * e o `Details` a lê direto do produto do contexto da página.
 */
export interface ProductDetailsData {
  name: string
  offers: ProductOffers
  additionalProperty?: ProductAdditionalProperty[]
  availableInstallments?: ProductInstallment[]
}
