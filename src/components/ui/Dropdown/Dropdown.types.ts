export interface DropdownOption {
  /** Texto exibido para a opção */
  label: string
  /** Valor único usado na seleção */
  value: string
  /** Desabilita a opção individualmente */
  disabled?: boolean
  /** Imagem de amostra exibida antes do label (ex: swatch de cor) */
  swatch?: string
}

export interface DropdownProps {
  /** Lista de opções a serem exibidas */
  options: DropdownOption[]
  /** Disparado quando uma opção é selecionada — o pai decide o que fazer */
  onSelected: (option: DropdownOption) => void
  /** Valor selecionado (modo controlado). Se omitido, o componente gerencia o próprio estado */
  value?: string
  /** Valor inicial (modo não-controlado) */
  defaultValue?: string
  /** Texto exibido quando nada está selecionado */
  placeholder?: string
  /** Texto fixo exibido antes do valor selecionado no trigger (ex.: "Ordenar por:") */
  prefix?: string
  /** Desabilita o dropdown inteiro */
  disabled?: boolean
  /** id base usado para acessibilidade (gerado automaticamente se omitido) */
  id?: string
  /** Rótulo acessível quando não há <label> associado */
  'aria-label'?: string
  /** Classe extra aplicada ao container */
  className?: string
}
