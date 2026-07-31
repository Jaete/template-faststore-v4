export interface BreadcrumbItem {
  /** Texto exibido para o item */
  label: string
  /** Link do item — quando omitido (ex.: página atual), é exibido como texto simples */
  href?: string
}

export interface BreadcrumbProps {
  /** Itens do breadcrumb, do mais externo (ex.: "Home") ao atual */
  items: BreadcrumbItem[]
}
