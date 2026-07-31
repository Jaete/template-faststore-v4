export interface ToggleProps {
  /** Disparado a cada alternância, recebendo o novo estado — o pai decide o que fazer */
  onToggle: (isOn: boolean) => void
  /** Estado ligado/desligado (modo controlado). Se omitido, o componente gerencia o próprio estado */
  on?: boolean
  /** Estado inicial (modo não-controlado) */
  defaultOn?: boolean
  /** Desabilita a interação */
  disabled?: boolean
  /** id do elemento */
  id?: string
  /** Rótulo acessível quando não há <label> associado */
  'aria-label'?: string
  /** Classe extra aplicada ao trilho */
  className?: string
}
