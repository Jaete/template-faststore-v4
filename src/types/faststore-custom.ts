/**
 * Tipos que descrevem campos adicionados por customizações nossas e que,
 * por isso, NÃO existem nos módulos do `@faststore/core` nem no codegen.
 *
 * Tudo o que o core realmente exporta deve ser importado do módulo real
 * (`src/sdk/*`, `@generated/graphql`) — os aliases são resolvidos pelo `paths`
 * do `tsconfig.json`. Declarar `declare module 'src/sdk/...'` para "completar"
 * um módulo do core sombreia o módulo inteiro para TODA a compilação (inclusive
 * os arquivos do próprio core) e quebra o `yarn build`.
 */

/** Opção de parcelamento do resolver customizado `availableInstallments`. */
export interface PDPInstallment {
  installmentPaymentSystemName: string
  installmentValue: number
  installmentInterest: number
  installmentNumber: number
}

/** Um valor permitido de um anexo de SKU, do resolver customizado `skuAttachments`. */
export interface PDPSkuAttachmentValue {
  value: string
}

/** Um anexo (attachment) do SKU — ex.: voltagem, gravação personalizada. */
export interface PDPSkuAttachment {
  attachmentID: string
  name: string
  required: boolean
  values: PDPSkuAttachmentValue[]
}

/** Valor escolhido pelo usuário para um anexo, indexado pelo nome do anexo. */
export type PDPAttachmentSelection = Record<string, string>

/**
 * Um SKU do grupo, como vem de `isVariantOf.skuVariants.allVariantProducts`
 * (adicionado pelo fragment customizado `src/fragments/ClientProduct.ts`).
 *
 * `description` NÃO está aqui: a API resolve a description do `isVariantOf`,
 * então ela é igual para todos os SKUs e o fragment não a pede.
 */
export interface PDPVariantProduct {
  sku: string
  /** Slug canônico do SKU — fonte da URL na troca de variante. */
  slug: string
  name: string
  gtin: string
  image: Array<{
    url: string
    alternateName: string
  }>
  offers: {
    lowPrice: number
    offers: Array<{
      availability: string
      price: number
      listPrice: number
      quantity: number
      seller: { identifier: string }
    }>
  }
  additionalProperty: Array<{
    propertyID: string
    name: string
    value: unknown
    valueReference: unknown
  }>
  availableInstallments?: PDPInstallment[]
  skuAttachments?: PDPSkuAttachment[]
}

/** Termo sugerido de `useTopSearch_unstable`/`useSuggestions_unstable`. */
export interface SearchSuggestionTerm {
  value: string
}

/**
 * Uma variação de `skuVariants.availableVariations[dimensão]`.
 *
 * No codegen o campo é o scalar `JSON`, ou seja `any` — daí a necessidade de
 * anotar os callbacks que iteram sobre ele.
 */
export interface SkuVariation {
  alt: string
  label: string
  value: string
  src?: string
}
