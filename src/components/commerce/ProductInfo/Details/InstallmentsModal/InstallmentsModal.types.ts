import type { InstallmentRow } from '../useProductDetails'

export interface InstallmentsModalProps {
  /** Todas as parcelas disponíveis (2x+). */
  rows: InstallmentRow[]
}
