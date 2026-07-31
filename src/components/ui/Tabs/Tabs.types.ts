import type { ReactNode } from 'react'

export interface TabItem {
  id: string
  label: string
  content: ReactNode
}

export interface TabsProps {
  tabs: TabItem[]
  /** Aba ativa no primeiro render, quando o estado é não-controlado. */
  initialActiveId?: string
  /** Passe junto com `onActiveIdChange` para controlar a aba ativa de fora. */
  activeId?: string
  onActiveIdChange?: (id: string) => void
  /**
   * Mantém o conteúdo de todas as abas montado (só esconde as inativas via
   * `hidden`), em vez de montar/desmontar a cada troca. Preserva o estado
   * interno de cada aba (ex.: posição de scroll) e evita o custo de remontar.
   */
  keepMounted?: boolean
  className?: string
}
