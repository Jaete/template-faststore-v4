export interface RangeSliderProps {
  /** Limite mínimo absoluto do intervalo (ex: menor preço disponível) */
  min: number
  /** Limite máximo absoluto do intervalo (ex: maior preço disponível) */
  max: number
  /** Valor mínimo selecionado atualmente */
  valueMin: number
  /** Valor máximo selecionado atualmente */
  valueMax: number
  step?: number
  /** Disparado ao soltar um dos manípulos, com o novo intervalo selecionado */
  onChangeEnd: (value: { min: number; max: number }) => void
}
