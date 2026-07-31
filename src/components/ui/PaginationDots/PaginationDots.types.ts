export interface PaginationDotsProps {
  itemCount: number
  /** Índice ativo — mesmo estado controlado passado ao `Carousel`. */
  activeIndex: number
  /** Disparado ao clicar num dot. Se omitido, os dots são só indicativos. */
  onSelect?: (index: number) => void
  className?: string
}
