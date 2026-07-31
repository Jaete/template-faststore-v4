export interface Suggestion {
  term: string
  href: string
}

export interface SuggestionsProps {
  term: string
  onSelect?: (suggestion: Suggestion) => void
}
