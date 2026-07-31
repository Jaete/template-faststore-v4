import clsx from 'clsx'
import { usePriceFormatter } from 'src/sdk/product/useFormattedPrice'

import RangeSlider from '../../../ui/RangeSlider/RangeSlider'
import { commitOnEnter, usePriceRangeFacet } from './usePriceRangeFacet'
import type { PriceRangeFacetProps } from './PriceRangeFacet.types'
import styles from './PriceRangeFacet.module.scss'

function PriceRangeFacet({ facet, selected, onChange }: PriceRangeFacetProps) {
  const formatPrice = usePriceFormatter()
  const {
    selectedMin,
    selectedMax,
    minInput,
    maxInput,
    handleMinFocus,
    handleMaxFocus,
    handleMinInputChange,
    handleMaxInputChange,
    handleMinBlur,
    handleMaxBlur,
  } = usePriceRangeFacet({ facet, selected, onChange })

  return (
    <div className={styles.priceRangeFacet}>
      <div className={styles.priceRangeFacet__bounds}>
        <span>{formatPrice(facet.min.absolute)}</span>
        <span>{formatPrice(facet.max.absolute)}</span>
      </div>

      <RangeSlider
        min={facet.min.absolute}
        max={facet.max.absolute}
        valueMin={selectedMin}
        valueMax={selectedMax}
        onChangeEnd={onChange}
      />

      <div className={styles.priceRangeFacet__selected}>
        <div className={styles.priceRangeFacet__field}>
          <span className={styles.priceRangeFacet__label}>Mínimo</span>
          <div className={styles.priceRangeFacet__valueBox}>
            <span className={styles.priceRangeFacet__currency}>R$</span>
            <input
              type="number"
              inputMode="decimal"
              className={styles.priceRangeFacet__value}
              value={minInput}
              onFocus={handleMinFocus}
              onChange={handleMinInputChange}
              onBlur={handleMinBlur}
              onKeyDown={commitOnEnter}
            />
          </div>
        </div>
        <div
          className={clsx(
            styles.priceRangeFacet__field,
            styles['priceRangeFacet__field--end']
          )}
        >
          <span className={styles.priceRangeFacet__label}>Máximo</span>
          <div className={styles.priceRangeFacet__valueBox}>
            <span className={styles.priceRangeFacet__currency}>R$</span>
            <input
              type="number"
              inputMode="decimal"
              className={styles.priceRangeFacet__value}
              value={maxInput}
              onFocus={handleMaxFocus}
              onChange={handleMaxInputChange}
              onBlur={handleMaxBlur}
              onKeyDown={commitOnEnter}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriceRangeFacet
