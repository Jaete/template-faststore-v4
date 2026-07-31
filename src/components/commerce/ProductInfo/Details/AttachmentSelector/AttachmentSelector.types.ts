import type {
  PDPAttachmentSelection,
  PDPSkuAttachment,
} from '../../../../../types/faststore-custom'

export interface AttachmentSelectorProps {
  /** Anexos disponíveis para o SKU exibido, do resolver `skuAttachments`. */
  attachments: PDPSkuAttachment[]
  /** Valor escolhido para cada anexo, por nome (do `ActiveSkuProvider`). */
  selection: PDPAttachmentSelection
  /** Define o valor escolhido para um anexo. */
  onSelect: (attachmentName: string, value: string) => void
}
