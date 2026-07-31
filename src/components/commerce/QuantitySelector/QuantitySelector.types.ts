export interface QuantitySelectorProps {
  /** Quantidade atual exibida. */
  quantity: number
  /** Chamado com a nova quantidade ao clicar em - ou +. Quem usa decide o efeito. */
  onChange: (quantity: number) => void
  /** Quantidade mínima permitida. */
  min?: number
  /** Quantidade máxima permitida. Sem valor, não há limite superior. */
  max?: number
  /** Desabilita o seletor por inteiro. */
  disabled?: boolean
  /** Classe extra aplicada ao container (ex: sobrescrever --quantity-selector-width/height). */
  className?: string
}
