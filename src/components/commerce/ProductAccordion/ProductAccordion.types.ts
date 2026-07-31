/** Props da section ProductAccordion vindas do CMS. */
export interface ProductAccordionProps {
  /** Título da aba de descrição do produto. */
  descriptionTitle?: string
  /**
   * Exibe a aba de medidas físicas do SKU. Requer o resolver `skuDimensions`,
   * que só funciona com `VTEX_APP_KEY_SKU`/`VTEX_APP_TOKEN_SKU` configuradas.
   */
  showMeasurements?: boolean
  /** Título da aba de medidas físicas. */
  measurementsTitle?: string
}
