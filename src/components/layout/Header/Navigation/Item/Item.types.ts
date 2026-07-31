export interface ItemProps {
  /** Texto exibido no link */
  label: string
  /** URL de destino ao clicar diretamente no item */
  href: string
  /** Exibe o chevron indicando que o item expande conteúdo no hover */
  expandable?: boolean
  /** Realce do item cujo conteúdo está aberto no painel */
  active?: boolean
  /**
   * Variante de cor/espaçamento:
   * - `default`: itens da coluna de departamentos (texto dark, fundo branco)
   * - `muted`: itens de categorias do painel cinza (texto medium)
   * - `panel`: itens de subcategorias do painel cinza (texto dark)
   */
  variant?: 'default' | 'muted' | 'panel'
}
