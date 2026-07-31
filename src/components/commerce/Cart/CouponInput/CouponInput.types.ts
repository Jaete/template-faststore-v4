/** Textos configuráveis via CMS (bloco `coupon` do footer do Minicart) */
export interface CouponInputTexts {
  enabled?: boolean
  placeholder?: string
  applyLabel?: string
  removeLabel?: string
  successMessage?: string
  errorMessage?: string
}

export interface CouponResult {
  /** Soma dos descontos aplicados ao carrinho, em reais. */
  discount: number
  /** Total do carrinho após o desconto (sem frete), em reais. */
  total: number
}

export interface CouponInputProps extends Omit<CouponInputTexts, 'enabled'> {
  /** Chamado com os totais recalculados ao aplicar/remover o cupom (`null` quando removido/inválido). */
  onCouponApplied?: (result: CouponResult | null) => void
  /** Desabilita campo e botão (ex: enquanto o carrinho revalida). */
  disabled?: boolean
}
