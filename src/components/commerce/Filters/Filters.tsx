import clsx from 'clsx'

import Accordion from '../../ui/Accordion/Accordion'
import Checkbox from '../../ui/Checkbox/Checkbox'
import PriceRangeFacet from './PriceRangeFacet/PriceRangeFacet'
import { useFilters } from './useFilters'
import type { FiltersProps } from './Filters.types'
import styles from './Filters.module.scss'

function Filters({ allowedFacets, variant = 'default' }: FiltersProps) {
  const {
    facets,
    rangeFacet,
    selectedPriceRange,
    handleToggleValue,
    handleRangeChange,
  } = useFilters({ allowedFacets })

  if (!facets.length && !rangeFacet) {
    return null
  }

  const isDrawer = variant === 'drawer'

  return (
    <div
      className={clsx(styles.filters, isDrawer && styles['filters--drawer'])}
    >
      {/* No drawer, o header do próprio Drawer já exibe "Filtros". */}
      {!isDrawer && <span className={styles.filters__title}>Filtros</span>}
      <div className={styles.filters__list}>
        {facets.map((facet, index) => (
          <Accordion
            key={facet.key}
            title={facet.label.toLocaleLowerCase()}
            defaultOpen={index === 0}
          >
            {facet.values.map((value) => (
              <Checkbox
                key={value.value}
                label={value.label}
                count={value.quantity ?? undefined}
                checked={value.selected}
                onChange={() => handleToggleValue(facet.key, value.value)}
              />
            ))}
          </Accordion>
        ))}
        {rangeFacet && (
          <div className={styles.filters__rangeFacet}>
            <span className={styles.filters__rangeFacetTitle}>
              {'faixa de preço'}
            </span>
            <PriceRangeFacet
              facet={rangeFacet}
              selected={selectedPriceRange}
              onChange={handleRangeChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Filters
