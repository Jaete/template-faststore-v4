import SkuDimensionGroup from './SkuDimensionGroup/SkuDimensionGroup'
import type { SkuSelectorProps } from './SkuSelector.types'
import styles from './SkuSelector.module.scss'

/**
 * Seletor de SKU da PDP. Renderiza um grupo por dimensão de variação que o
 * catálogo expõe (TAMANHO, MATERIAL, COR, VERSAO, ...) — nenhuma dimensão é
 * hardcoded, então produtos com combinações diferentes funcionam sem mudança de
 * código.
 *
 * Clicar numa opção troca o SKU exibido no cliente, sem navegação. As dimensões
 * vêm prontas de `useSkuSelector`.
 */
function SkuSelector({ dimensions, onSelect }: SkuSelectorProps) {
  if (dimensions.length === 0) {
    return null
  }

  return (
    <div className={styles.skuSelector}>
      {dimensions.map((dimension) => (
        <SkuDimensionGroup
          key={dimension.name}
          dimension={dimension}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

export default SkuSelector
