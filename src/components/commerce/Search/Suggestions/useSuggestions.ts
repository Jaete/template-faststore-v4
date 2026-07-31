import { useDeferredValue, useMemo } from 'react'

import { formatSearchState, initSearchState } from '@faststore/sdk'
import { useSuggestions_unstable } from '@faststore/core/experimental'

import type { Suggestion } from './Suggestions.types'

const SEARCH_BASE = '/s'
const MAX_SUGGESTIONS = 6

interface UseSuggestionsParams {
  term: string
}

export interface HighlightPart {
  text: string
  match: boolean
}

export function buildSearchHref(term: string): string {
  const { pathname, search } = formatSearchState(
    initSearchState({ term, base: SEARCH_BASE })
  )

  return `${pathname}${search}`
}

/** Quebra o valor da sugestão em partes, marcando o trecho que casa com o termo buscado. */
export function highlightTerm(value: string, term: string): HighlightPart[] {
  const query = term.trim()

  if (!query) {
    return [{ text: value, match: false }]
  }

  const index = value.toLowerCase().indexOf(query.toLowerCase())

  if (index === -1) {
    return [{ text: value, match: false }]
  }

  return [
    { text: value.slice(0, index), match: false },
    { text: value.slice(index, index + query.length), match: true },
    { text: value.slice(index + query.length), match: false },
  ].filter((part) => part.text.length > 0)
}

export function useSuggestions({ term }: UseSuggestionsParams) {
  const deferredTerm = useDeferredValue(term.trim())
  const hasTerm = deferredTerm.length > 0

  const { data, error } = useSuggestions_unstable(deferredTerm)

  const suggestions = useMemo<Suggestion[]>(() => {
    if (!hasTerm) {
      return []
    }

    const terms = data?.search.suggestions.terms ?? []

    // Fallback: quando o Intelligent Search não devolve termos de autocomplete,
    // usamos o nome dos produtos sugeridos como termo de busca.
    const rawTerms =
      terms.length > 0
        ? terms.map(({ value }) => value)
        : (data?.search.suggestions.products ?? []).map(({ name }) => name)

    const uniqueTerms = Array.from(new Set(rawTerms))

    // Ordena pela proximidade do termo com o início do texto (match mais à
    // esquerda primeiro); sem match vai para o fim.
    const query = deferredTerm.toLowerCase()
    const matchIndex = (value: string) => {
      const index = value.toLowerCase().indexOf(query)
      return index === -1 ? Number.POSITIVE_INFINITY : index
    }

    const sortedTerms = uniqueTerms
      .slice()
      .sort((a, b) => matchIndex(a) - matchIndex(b))

    return sortedTerms.slice(0, MAX_SUGGESTIONS).map((value) => ({
      term: value,
      href: buildSearchHref(value),
    }))
  }, [data, hasTerm, deferredTerm])

  const isLoading = hasTerm && !error && !data

  return {
    term: deferredTerm,
    suggestions,
    isLoading,
    isEmpty: hasTerm && !isLoading && suggestions.length === 0,
  }
}
