import { useState } from 'react'

import Drawer from '../../../ui/Drawer/Drawer'
import IconButton from '../../../ui/IconButton/IconButton'
import { SearchIcon, CloseIcon } from '../../../ui/Icons'
import { EventName } from '../../../../utils/events'
import Suggestions from '../Suggestions/Suggestions'
import MostSearched from '../MostSearched/MostSearched'
import CategoryCarousel from '../CategoryCarousel/CategoryCarousel'
import SuggestionsShelf from '../SuggestionsShelf/SuggestionsShelf'
import styles from './Drawer.module.scss'
import type { SearchDrawerProps } from './Drawer.types'

function SearchDrawer({
  topSearches,
  categories,
  suggestionsShelf,
}: SearchDrawerProps) {
  const [term, setTerm] = useState('')
  const hasTerm = Boolean(term.trim())

  return (
    <Drawer
      openEventName={EventName.OpenSearchDrawer}
      title="Busca"
      closeAriaLabel="Fechar busca"
    >
      <div className={styles.searchDrawer}>
        <div className={styles.searchDrawer__content}>
          <div className={styles.searchDrawer__searchBar}>
            <input
              type="search"
              className={styles.searchDrawer__input}
              placeholder="Buscar produtos"
              aria-label="Buscar produtos"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
            />
            {hasTerm ? (
              <IconButton ariaLabel="Limpar busca" onClick={() => setTerm('')}>
                <CloseIcon className={styles.searchDrawer__searchIcon} />
              </IconButton>
            ) : (
              <SearchIcon className={styles.searchDrawer__searchIcon} />
            )}
          </div>

          {hasTerm ? (
            <Suggestions term={term} />
          ) : (
            <MostSearched topSearches={topSearches} />
          )}
        </div>

        {hasTerm
          ? suggestionsShelf && (
              <div className={styles.searchDrawer__footer}>
                <SuggestionsShelf {...suggestionsShelf} term={term.trim()} />
              </div>
            )
          : categories &&
            categories.length > 0 && (
              <div className={styles.searchDrawer__footer}>
                <CategoryCarousel categories={categories} />
              </div>
            )}
      </div>
    </Drawer>
  )
}

export default SearchDrawer
