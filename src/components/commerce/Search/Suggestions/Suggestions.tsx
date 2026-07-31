import type { SuggestionsProps } from './Suggestions.types'
import { highlightTerm, useSuggestions } from './useSuggestions'
import styles from './Suggestions.module.scss'

const SKELETON_ROWS = Array.from({ length: 6 })

function Suggestions({ term, onSelect }: SuggestionsProps) {
  const {
    term: activeTerm,
    suggestions,
    isLoading,
    isEmpty,
  } = useSuggestions({
    term,
  })

  if (!activeTerm) {
    return null
  }

  if (isLoading) {
    return (
      <div className={styles.suggestions} aria-busy="true">
        <ul className={styles.suggestions__list}>
          {SKELETON_ROWS.map((_, index) => (
            <li key={index} className={styles.suggestions__skeleton} />
          ))}
        </ul>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className={styles.suggestions}>
        <p className={styles.suggestions__empty}>
          Nenhuma sugestão para “{activeTerm}”.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.suggestions}>
      <ul className={styles.suggestions__list}>
        {suggestions.map((suggestion) => (
          <li key={suggestion.term} className={styles.suggestions__item}>
            <a
              href={suggestion.href}
              className={styles.suggestions__link}
              onClick={() => onSelect?.(suggestion)}
            >
              {highlightTerm(suggestion.term, activeTerm).map((part, index) =>
                part.match ? (
                  <strong key={index} className={styles.suggestions__match}>
                    {part.text}
                  </strong>
                ) : (
                  <span key={index}>{part.text}</span>
                )
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Suggestions
