import Dropdown from '../../../../ui/Dropdown/Dropdown'
import type { AttachmentSelectorProps } from './AttachmentSelector.types'
import styles from './AttachmentSelector.module.scss'

/**
 * Seletor dos anexos (attachments) do SKU exibido — um dropdown por anexo que
 * o catálogo expõe (voltagem, gravação personalizada, ...). Nenhum nome de
 * anexo é hardcoded: o componente renderiza o que vier em `skuAttachments`.
 *
 * Diferente do `SkuSelector`: escolher um valor aqui NÃO troca o SKU exibido,
 * só compõe o item que vai para o carrinho. Anexos `required` sem valor
 * bloqueiam o botão de compra (ver `useBuyBlock`), porque a VTEX rejeita o
 * item no checkout nesse caso.
 */
function AttachmentSelector({
  attachments,
  selection,
  onSelect,
}: AttachmentSelectorProps) {
  const selectable = attachments.filter(
    (attachment) => attachment.values.length > 0
  )

  if (selectable.length === 0) {
    return null
  }

  return (
    <div className={styles.attachmentSelector}>
      {selectable.map((attachment) => (
        <div
          key={attachment.attachmentID}
          className={styles.attachmentSelector__group}
        >
          <p className={styles.attachmentSelector__label}>
            {attachment.name}
            {attachment.required && (
              <span className={styles.attachmentSelector__required}> *</span>
            )}
          </p>

          <Dropdown
            options={attachment.values.map(({ value }) => ({
              label: value,
              value,
            }))}
            value={selection[attachment.name]}
            placeholder="Selecione"
            aria-label={attachment.name}
            onSelected={(option) => onSelect(attachment.name, option.value)}
          />
        </div>
      ))}
    </div>
  )
}

export default AttachmentSelector
