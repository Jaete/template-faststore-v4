import Dropdown from '../../../ui/Dropdown/Dropdown'
import type { DropdownOption } from '../../../ui/Dropdown/Dropdown.types'
import { FilterIcon, SortIcon } from '../../../ui/Icons'
import { dispatch, EventName } from '../../../../utils/events'
import type {
  ProductGridToolbarProps,
  SearchSort,
} from './ProductGridToolbar.types'
import styles from './ProductGridToolbar.module.scss'

// Opções de ordenação expostas ao usuário. Os `value` batem com o enum
// `SearchSort` do SDK (o mesmo que a VTEX aceita); `score_desc` é a relevância.
// Exportado para o modal de ordenação mobile (renderizado no ProductGrid)
// reaproveitar a mesma lista.
export const SORT_OPTIONS: DropdownOption[] = [
  { label: 'Relevância', value: 'score_desc' },
  { label: 'Menor preço', value: 'price_asc' },
  { label: 'Maior preço', value: 'price_desc' },
  { label: 'Mais vendidos', value: 'orders_desc' },
  { label: 'Lançamentos', value: 'release_desc' },
  { label: 'Maiores descontos', value: 'discount_desc' },
  { label: 'Nome (A-Z)', value: 'name_asc' },
  { label: 'Nome (Z-A)', value: 'name_desc' },
]

function ProductGridToolbar({
  total,
  sort,
  onSortChange,
}: ProductGridToolbarProps) {
  const productLabel = total === 1 ? 'produto' : 'produtos'

  return (
    <>
      <div className={styles.toolbar}>
        <span className={styles.toolbar__count}>
          {total} {productLabel}
        </span>

        <Dropdown
          className={styles.toolbar__sort}
          options={SORT_OPTIONS}
          value={sort}
          prefix="Ordenar por:"
          aria-label="Ordenar por"
          onSelected={(option) => onSortChange(option.value as SearchSort)}
        />
      </div>

      {/* Os handlers de sort/filtro vivem no ProductGrid, que escuta estes eventos. */}
      <div className={styles.toolbarMobile}>
        <div className={styles.toolbarMobile__actions}>
          <button
            type="button"
            className={styles.toolbarMobile__button}
            onClick={() => dispatch(EventName.OpenSortModal)}
          >
            <SortIcon className={styles.toolbarMobile__icon} />
            <span className={styles.toolbarMobile__label}>Ordenar por</span>
          </button>

          <button
            type="button"
            className={styles.toolbarMobile__button}
            onClick={() => dispatch(EventName.OpenFilterDrawer)}
          >
            <FilterIcon className={styles.toolbarMobile__icon} />
            <span className={styles.toolbarMobile__label}>Filtrar por</span>
          </button>
        </div>

        <span className={styles.toolbarMobile__count}>
          {total} {productLabel}
        </span>
      </div>
    </>
  )
}

export default ProductGridToolbar
