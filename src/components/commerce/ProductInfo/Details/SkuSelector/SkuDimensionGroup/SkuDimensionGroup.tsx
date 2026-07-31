import SkuOptionChip from '../SkuOptionChip/SkuOptionChip'
import type { SkuDimensionGroupProps } from '../SkuSelector.types'
import styles from './SkuDimensionGroup.module.scss'

/**
 * Uma dimensão de variação: rótulo mais a linha de chips.
 * O rótulo inclui o valor selecionado, que é o
 * que o usuário precisa ler quando os chips são swatches de cor.
 */
function SkuDimensionGroup({ dimension, onSelect }: SkuDimensionGroupProps) {
  if (dimension.options.length === 0) {
    return null
  }

  return (
    <div className={styles.skuDimensionGroup}>
      <p className={styles.skuDimensionGroup__label}>
        {dimension.label}
        {dimension.selectedValue && (
          <span className={styles.skuDimensionGroup__value}>
            : {dimension.selectedValue}
          </span>
        )}
      </p>

      <div
        className={styles.skuDimensionGroup__options}
        role="group"
        aria-label={dimension.label}
      >
        {dimension.options.map((option) => (
          <SkuOptionChip
            key={option.value}
            option={option}
            dimensionName={dimension.label}
            display={dimension.display}
            onSelect={(value) => onSelect(dimension.name, value)}
          />
        ))}
      </div>
    </div>
  )
}

export default SkuDimensionGroup
