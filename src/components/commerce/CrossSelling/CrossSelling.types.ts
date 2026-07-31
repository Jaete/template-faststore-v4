export interface CrossSellingProps {
  /** Título da section. */
  title?: string
  /** Texto do selo que marca o produto da PDP atual dentro da lista. */
  currentProductLabel?: string
  /** Texto do card de total, antes do preço do combo. */
  totalLabel?: string
  /** Texto do botão que adiciona o combo ao carrinho. */
  buttonLabel?: string
}

/** Um produto da lista do compre junto, já pronto para render. */
export interface CrossSellingItem {
  /** `sku` (itemId) — chave estável e identificador enviado ao carrinho. */
  id: string
  name: string
  href: string
  image: {
    src: string
    alt: string
  }
  listPrice: number
  sellingPrice: number
  /** `true` no produto da PDP atual, que recebe o selo e não pode ser desmarcado. */
  isCurrentProduct: boolean
  /** Item entra na soma do combo apenas quando selecionado. */
  selected: boolean
  /** Posição do slot relacionado (0, 1, ...) que exibe este item — `undefined` no produto atual. */
  slot?: number
}
