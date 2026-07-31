import type { MouseEvent, ReactNode } from 'react'

export interface ButtonProps {
  label: string
  variant?:
    | 'primary'
    | 'primary-text'
    | 'secondary'
    | 'secondary-text'
    | 'secondary-stroke'
    | 'tertiary'
    | 'tertiary-stroke'
    | 'tertiary-text'
    | 'stroke-white'
  disabled?: boolean
  /** Substitui o label por um spinner e bloqueia cliques enquanto ativo. */
  loading?: boolean
  icon?: ReactNode
  href?: string
  type?: 'button' | 'submit' | 'reset'
  // Sintaxe de método (bivariante): aceita tanto handlers sem argumento quanto
  // os dos hooks do core, tipados com MouseEvent<HTMLButtonElement>
  onClick?(event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>): void
}
