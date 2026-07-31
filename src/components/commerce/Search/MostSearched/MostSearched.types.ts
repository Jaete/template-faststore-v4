import type { Suggestion } from '../Suggestions/Suggestions.types'

export interface MostSearchedProps {
  /** Termos definidos manualmente via CMS. Quando presentes, têm prioridade sobre os termos mais buscados calculados automaticamente. Máx. 10. */
  topSearches?: string[]
  onSelect?: (suggestion: Suggestion) => void
}
