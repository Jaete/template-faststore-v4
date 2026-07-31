import type { ReactNode } from 'react'

export interface AccordionProps {
  title: string
  defaultOpen?: boolean
  /** Distância entre o header e o conteúdo, em px. Sobrescreve o espaçamento padrão. */
  contentPadding?: number
  /** Ícone do header: seta que gira (padrão) ou +/- que alterna com a abertura. */
  icon?: 'chevron' | 'plusMinus'
  children: ReactNode
}
