import type { CouponInputTexts } from '../CouponInput/CouponInput.types'

export interface MinicartFooterTexts {
  /** Cupom de desconto exibido acima do subtotal. */
  coupon?: CouponInputTexts
  /** Rótulo da linha de subtotal. Sem valor, usa "Subtotal". */
  subtotalLabel?: string
  /** Rótulo da linha de descontos. Sem valor, usa "Descontos". */
  discountLabel?: string
  /** Rótulo da linha de total. Sem valor, usa "Total". */
  totalLabel?: string
  /** Nota exibida acima dos botões. Sem valor, usa "Frete e descontos serão calculados no checkout". */
  shippingNote?: string
  /** Texto do botão de checkout. Sem valor, usa "Finalizar compra". */
  checkoutButtonLabel?: string
  /** Texto do botão que fecha o minicart. Sem valor, usa "Continuar comprando". */
  continueButtonLabel?: string
}

export interface MinicartFooterProps extends MinicartFooterTexts {
  /** Soma dos preços de lista dos itens (sem descontos, sem frete). */
  subtotal: number
  /** Soma dos descontos aplicados aos itens. */
  discount: number
  /** Soma dos preços de venda dos itens (com descontos, sem frete). */
  total: number
  /** true enquanto o carrinho revalida — troca o texto do checkout por um spinner. */
  isValidating?: boolean
}
