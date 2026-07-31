import type { ReactNode } from 'react'

export interface DrawerProps {
  /** Nome do CustomEvent (disparado em `window`) que abre este drawer */
  openEventName: string
  /** Nome do CustomEvent (disparado em `window`) que fecha este drawer —
   * permite que conteúdo dentro de `children` peça o fechamento sem
   * conhecer o Drawer */
  closeEventName?: string
  /** Conteúdo do header, ao lado do X — permite compor outros átomos */
  title?: ReactNode
  /** Conteúdo do corpo do drawer */
  children: ReactNode
  /** Conteúdo fixo abaixo do corpo. Não respeita o padding do corpo —
   * renderiza "por fora" (full-bleed), mas ainda dentro do painel */
  footer?: ReactNode
  /** Rótulo acessível do botão de fechar */
  closeAriaLabel?: string
  /** Chamado sempre que o drawer termina de fechar (overlay, X ou Esc) */
  onClose?: () => void
}
