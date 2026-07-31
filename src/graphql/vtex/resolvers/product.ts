/**
 * Resolver que expõe as opções de parcelamento (`availableInstallments`) no
 * `StoreProduct`, lendo a oferta comercial do primeiro seller do produto.
 *
 * Segue o guia oficial da VTEX para FastStore ("adding installment information
 * in the product details page"): os dados vêm de
 * `sellers[0].commertialOffer.Installments`.
 */

import { parseAttachmentDomainValues } from '../../../utils/skuAttachments'

/** Parcela como vem da oferta comercial (commertialOffer) da VTEX. */
interface VtexInstallment {
  Value: number
  InterestRate: number
  NumberOfInstallments: number
  PaymentSystemName: string
}

// Shape confirmado em runtime — a VTEX não o documenta, e os nomes dos
// campos (snake_case em `fields`) destoam do resto do payload do Search.
interface VtexSkuAttachment {
  id: number
  name: string
  isRequired: boolean
  fields: Array<{
    field_name: string
    domain_values: string
  }>
}

/** Slice do root do StoreProduct que carrega as ofertas dos sellers. */
interface StoreProductRoot {
  sellers?: Array<{
    commertialOffer?: {
      Installments?: VtexInstallment[]
    }
  }>
  // O root do `StoreProduct` é o `EnhancedSku` do Intelligent Search, que já
  // traz `attachments`. O resolver `additionalProperty` do core lê
  // `attachmentsValues` — campo só populado em item de carrinho —, por isso
  // os anexos do SKU ficam invisíveis na PDP apesar de estarem em memória.
  attachments?: VtexSkuAttachment[]
}

const productResolver = {
  StoreProduct: {
    availableInstallments: (root: StoreProductRoot) => {
      const installments = root.sellers?.[0]?.commertialOffer?.Installments

      if (!installments?.length) {
        return []
      }

      return installments.map((installment) => ({
        installmentPaymentSystemName: installment.PaymentSystemName,
        installmentValue: installment.Value,
        installmentInterest: installment.InterestRate,
        installmentNumber: installment.NumberOfInstallments,
      }))
    },

    skuAttachments: (root: StoreProductRoot) =>
      (root.attachments ?? []).map((attachment) => ({
        attachmentID: String(attachment.id),
        name: attachment.name,
        required: Boolean(attachment.isRequired),
        values: parseAttachmentDomainValues(attachment.fields).map((value) => ({
          value,
        })),
      })),
  },
}

export default productResolver
