export interface CheckboxProps {
  label: string
  checked: boolean
  onChange: () => void
  /** Contador exibido ao lado do label (ex: quantidade de produtos do filtro) */
  count?: number
}
