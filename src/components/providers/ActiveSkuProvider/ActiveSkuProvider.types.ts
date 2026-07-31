import type { PDPVariantProduct } from '../../../types/faststore-custom'

/** Contexto do SKU ativo da PDP — permite trocar de variante sem navegar. */
export interface ActiveSkuContextValue {
  /** SKU exibido agora. */
  product: PDPVariantProduct
  /** SKU (itemId) ativo. */
  activeSku: string
  /** Variações do SKU exibido, ex.: `{ TAMANHO: '180 cm', AQUECEDOR: 'Não' }`. */
  activeVariations: Record<string, string>
  /** `true` quando o SKU exibido tem estoque em pelo menos um seller. */
  isAvailable: boolean
  /** Troca uma dimensão preservando as outras. */
  selectVariation: (dimensionName: string, value: string) => void
  /** Resolve o SKU de um combo completo de variações. */
  resolveVariant: (
    variations: Record<string, string>
  ) => PDPVariantProduct | undefined
  /** `true` até `allVariantProducts` chegar. */
  isVariantsPending: boolean
  /** Seleção de anexos (attachments) do SKU exibido, por nome do anexo. */
  attachmentSelection: Record<string, string>
  /** Define o valor escolhido para um anexo do SKU exibido. */
  setAttachmentValue: (attachmentName: string, value: string) => void
}
