import Drawer from '../../../ui/Drawer/Drawer'
import Button from '../../../ui/Button/Button'
import { FilterIcon } from '../../../ui/Icons'
import Filters from '../../Filters/Filters'
import { useFilters } from '../../Filters/useFilters'
import { dispatch, EventName } from '../../../../utils/events'
import styles from './FilterDrawer.module.scss'

interface FilterDrawerProps {
  allowedFacets: string[]
}

// Drawer de filtros exibido apenas no mobile (aberto pelo botão "Filtrar por"
// do toolbar via EventName.OpenFilterDrawer). Reaproveita o componente Filters
// na variante `drawer` e adiciona o rodapé fixo do Figma (Limpar + Aplicar).
//
// Os filtros aplicam na hora (mesmo comportamento do desktop): "Limpar filtros"
// reseta facets + faixa de preço; "Aplicar" apenas fecha o drawer.
function FilterDrawer({ allowedFacets }: FilterDrawerProps) {
  const { handleClearAll, hasActiveFilters } = useFilters({ allowedFacets })

  return (
    <Drawer
      openEventName={EventName.OpenFilterDrawer}
      closeEventName={EventName.CloseFilterDrawer}
      title={
        <span className={styles.filterDrawer__title}>
          <FilterIcon className={styles.filterDrawer__titleIcon} />
          Filtros
        </span>
      }
      closeAriaLabel="Fechar filtros"
      footer={
        <div className={styles.filterDrawer__footer}>
          <Button
            label="Limpar filtros"
            variant="tertiary-stroke"
            disabled={!hasActiveFilters}
            onClick={handleClearAll}
          />
          <Button
            label="Aplicar"
            variant="secondary"
            onClick={() => dispatch(EventName.CloseFilterDrawer)}
          />
        </div>
      }
    >
      <Filters allowedFacets={allowedFacets} variant="drawer" />
    </Drawer>
  )
}

export default FilterDrawer
