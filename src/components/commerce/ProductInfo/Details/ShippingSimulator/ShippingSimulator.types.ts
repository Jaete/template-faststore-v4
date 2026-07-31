export interface ShippingSimulatorProps {
  /** SKU do produto exibido, usado como `id` do item na simulação de frete. */
  sku: string
  /** Identificador do seller responsável pela oferta (fallback `"1"` no hook). */
  sellerId?: string
  className?: string
}

/** Uma linha de opção de frete já formatada para exibição. */
export interface ShippingRow {
  key: string
  name: string
  days: string
  isFree: boolean
  formattedPrice: string
}
