export interface FreeShippingBarTexts {
  /**
   * Mensagem enquanto o valor mínimo não foi atingido. O placeholder
   * `{remaining}` é substituído pelo valor restante formatado.
   * Sem valor, usa "Faltam {remaining} para você ganhar Frete Grátis!".
   */
  pendingMessage?: string
  /** Mensagem ao atingir o valor mínimo. Sem valor, usa "Você ganhou Frete Grátis!". */
  achievedMessage?: string
}

export interface FreeShippingBarProps extends FreeShippingBarTexts {
  /**
   * Valor mínimo para frete grátis. Apenas visual — a promoção real é
   * configurada nas Promoções da VTEX.
   */
  threshold: number
  /** Valor atual do carrinho (soma dos preços de venda). */
  currentValue: number
}
