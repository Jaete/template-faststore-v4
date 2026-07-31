import type { ComponentType, SVGProps } from 'react'

export interface ContactMethodProps {
  /** Ícone padrão (ignorado se `iconUrl` for informado) */
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  /** Ícone personalizado, exibido no lugar do ícone padrão */
  iconUrl?: string
  /** Texto exibido (ex.: telefone ou e-mail) */
  label: string
  /** Link opcional (ex.: `tel:...`, `mailto:...`) */
  href?: string
}
