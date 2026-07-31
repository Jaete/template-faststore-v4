import { useMemo } from 'react'

import { useTopSearch_unstable } from '@faststore/core/experimental'
import type { SearchSuggestionTerm } from '../../../../types/faststore-custom'

import type { Suggestion } from '../Suggestions/Suggestions.types'
import { buildSearchHref } from '../Suggestions/useSuggestions'

const MAX_MOST_SEARCHED = 10

export function useMostSearched(topSearches?: string[]) {
  const { data } = useTopSearch_unstable()

  const terms = useMemo<Suggestion[]>(() => {
    const manualTerms = (topSearches ?? []).filter(Boolean)

    const rawTerms =
      manualTerms.length > 0
        ? manualTerms
        : (data?.search.suggestions.terms ?? []).map(
            ({ value }: SearchSuggestionTerm) => value
          )

    return rawTerms.slice(0, MAX_MOST_SEARCHED).map((value) => ({
      term: value,
      href: buildSearchHref(value),
    }))
  }, [data, topSearches])

  return { terms }
}
