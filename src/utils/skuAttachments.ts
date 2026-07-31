/** Anexos (attachments) de SKU da VTEX — ex.: voltagem, gravação personalizada. Diferente de dimensão de variação: escolher um valor não troca o SKU exibido. */

/**
 * `field.domain_values` (Intelligent Search) é uma lista separada por
 * vírgula, com um valor vazio na frente (`,110v,220v`) — descartado aqui.
 */
export function parseAttachmentDomainValues(
  fields?: Array<{ domain_values?: string | null }> | null
): string[] {
  const seen = new Set<string>()
  const values: string[] = []

  for (const field of fields ?? []) {
    for (const raw of (field.domain_values ?? '').split(',')) {
      const value = raw.trim()

      if (value && !seen.has(value)) {
        seen.add(value)
        values.push(value)
      }
    }
  }

  return values
}

/**
 * Converte a escolha do usuário para um anexo em `additionalProperty` com
 * `valueReference: 'ATTACHMENT'` — é esse marcador que faz o resolver de
 * carrinho do `@faststore/core` repassar o par como
 * `attachments: [{name, content}]` no `updateOrderFormItems` da VTEX.
 */
export function attachmentSelectionToProperties(
  selection: Record<string, string>
) {
  return Object.entries(selection).map(([name, value]) => ({
    propertyID: name,
    name,
    value: { [name]: value },
    valueReference: 'ATTACHMENT',
  }))
}
