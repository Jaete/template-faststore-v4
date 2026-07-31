import type { MouseEvent, ReactNode } from 'react'

export interface IconButtonProps {
  children: ReactNode
  ariaLabel: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}
