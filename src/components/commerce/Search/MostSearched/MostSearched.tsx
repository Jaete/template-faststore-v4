import type { MostSearchedProps } from './MostSearched.types'
import { useMostSearched } from './useMostSearched'
import styles from './MostSearched.module.scss'

const COLUMN_SIZE = 5

function MostSearched({ topSearches, onSelect }: MostSearchedProps) {
  const { terms } = useMostSearched(topSearches)

  if (terms.length === 0) {
    return null
  }

  const columns = [
    terms.slice(0, COLUMN_SIZE),
    terms.slice(COLUMN_SIZE, COLUMN_SIZE * 2),
  ].filter((column) => column.length > 0)

  return (
    <div className={styles.mostSearched}>
      <p className={styles.mostSearched__title}>Mais buscados</p>

      <div className={styles.mostSearched__columns}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.mostSearched__column}>
            {column.map((suggestion, index) => (
              <a
                key={suggestion.term}
                href={suggestion.href}
                className={styles.mostSearched__link}
                onClick={() => onSelect?.(suggestion)}
              >
                <span className={styles.mostSearched__rank}>
                  {columnIndex * COLUMN_SIZE + index + 1}º
                </span>
                <span className={styles.mostSearched__term}>
                  {suggestion.term}
                </span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MostSearched
