import type { InputHTMLAttributes, ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  errorMessage?: string
  success?: boolean
  successMessage?: string
  /** Tipografia da mensagem abaixo do campo. `compact` = Outfit 11px/140%. */
  messageVariant?: 'default' | 'compact'
  children?: ReactNode
}
