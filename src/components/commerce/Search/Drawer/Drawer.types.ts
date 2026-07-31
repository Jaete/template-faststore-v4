import type { SearchCategory } from '../CategoryCarousel/CategoryCarousel.types'
import type { SuggestionsShelfProps } from '../SuggestionsShelf/SuggestionsShelf.types'

export interface SearchDrawerProps {
  /** Termos "mais buscados" vindos do CMS. Quando ausentes, o MostSearched calcula automaticamente. */
  topSearches?: string[]
  /** Categorias exibidas no carrossel do footer da busca (exibido sem termo digitado). */
  categories?: SearchCategory[]
  /** Vitrine de produtos exibida no footer da busca quando há termo digitado, no lugar das categorias. */
  suggestionsShelf?: SuggestionsShelfProps
}
