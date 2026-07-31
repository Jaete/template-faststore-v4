import type { ReactNode } from 'react'

export interface ModalProps {
  /** Nome do CustomEvent (disparado em `window`) que abre este modal */
  openEventName: string
  /** Nome do CustomEvent (disparado em `window`) que fecha este modal —
   * permite que conteúdo dentro de `children` peça o fechamento sem
   * conhecer o Modal */
  closeEventName?: string
  /** Conteúdo do header, ao lado do X */
  title?: ReactNode
  /** Ícone opcional exibido antes do título, no header */
  titleIcon?: ReactNode
  /** Conteúdo do corpo do modal */
  children: ReactNode
  /** Conteúdo fixo abaixo do corpo. Não respeita o padding do corpo —
   * renderiza "full-bleed", mas ainda dentro do card */
  footer?: ReactNode
  /** Rótulo acessível do botão de fechar */
  closeAriaLabel?: string
  /** Chamado sempre que o modal termina de fechar (overlay, X ou Esc) */
  onClose?: () => void
}
