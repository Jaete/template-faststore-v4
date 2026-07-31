/**
 * Tipos do seletor de SKU da PDP.
 *
 * O seletor é genérico: o catálogo define quais dimensões existem (TAMANHO,
 * MATERIAL, COR, VERSAO, ...) e o componente só renderiza o que vier em
 * `availableVariations`. Nenhum nome de dimensão é hardcoded.
 */

/** Como os valores de uma dimensão são renderizados. */
export type SkuVariantDisplay = 'text' | 'color'

/** Variação crua vinda de `skuVariants.availableVariations[dimensão]`. */
export interface RawSkuVariation {
  alt: string
  label: string
  value: string
  src?: string
}

/** Slice de `isVariantOf.skuVariants` consumido pelo seletor. */
export interface SkuVariantsData {
  activeVariations: Record<string, string> | null
  slugsMap: Record<string, string> | null
  availableVariations: Record<string, RawSkuVariation[]> | null
}

/**
 * Slice de um SKU de `allVariantProducts` necessário para responder estoque e
 * variações (`findBestVariantForValue`/`isVariantInStock`, em
 * `src/utils/skuVariants.ts`).
 */
export interface SkuVariantForStock {
  offers?: {
    offers?: Array<{ availability?: string; quantity?: number }>
  }
  additionalProperty?: Array<{
    name: string
    value: unknown
    valueReference: unknown
  }>
}

/** Uma opção clicável dentro de uma dimensão. */
export interface SkuOption {
  /** Valor da variação como o catálogo expõe (ex.: "180 cm"). */
  value: string
  /** Texto exibido no chip. */
  label: string
  /** `true` quando é a variação do SKU atualmente exibido. */
  selected: boolean
  /**
   * `false` quando o SKU mais próximo com esse valor (achado por
   * `findBestVariantForValue`, ignorando a própria dimensão) está sem estoque —
   * o chip ganha o visual riscado, mas continua CLICÁVEL: clicar troca para
   * esse SKU sem estoque, o que faz a coluna trocar para o bloco "Avise-me"
   * (ver `isAvailable` do `ActiveSkuProvider`). NÃO significa "combinação
   * inexistente": todo valor do catálogo aparece como chip.
   */
  available: boolean
  /**
   * Cor do swatch, só no display `color`. Vem do `alt`/`label` da variação
   * quando é um valor de cor CSS válido.
   */
  swatchColor?: string
  /** Imagem do swatch, quando o catálogo expõe (`src` da variação). */
  swatchImage?: string
}

/** Uma dimensão de variação já pronta para renderizar. */
export interface SkuDimension {
  /** Nome da dimensão como vem do catálogo (ex.: "TAMANHO"). */
  name: string
  /** Rótulo exibido acima dos chips. */
  label: string
  /** Como renderizar os valores desta dimensão. */
  display: SkuVariantDisplay
  /** Valor atualmente selecionado, se houver. */
  selectedValue?: string
  options: SkuOption[]
}

export interface SkuSelectorProps {
  /**
   * Dimensões já derivadas por `useSkuSelector`. O hook é chamado por quem
   * renderiza o seletor (o `Details`), que precisa saber se há variações para
   * decidir sobre a divisória — assim a derivação acontece uma única vez.
   */
  dimensions: SkuDimension[]
  /** Troca uma dimensão preservando as outras (do `ActiveSkuProvider`). */
  onSelect: (dimensionName: string, value: string) => void
}

/** Props de um grupo de opções de uma única dimensão. */
export interface SkuDimensionGroupProps {
  dimension: SkuDimension
  /** Troca a dimensão deste grupo. */
  onSelect: (dimensionName: string, value: string) => void
}

/** Props de um chip individual. */
export interface SkuOptionChipProps {
  option: SkuOption
  /** Nome da dimensão, usado no `aria-label` do chip. */
  dimensionName: string
  display: SkuVariantDisplay
  /** Chamado no clique — o grupo já sabe qual dimensão é. */
  onSelect: (value: string) => void
}
