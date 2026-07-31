import type { SkuOptionChipProps } from '../SkuSelector.types'
import styles from './SkuOptionChip.module.scss'

/**
 * Opção individual de uma dimensão de variação.
 *
 * É um `<button>`, não um link: a troca de variante acontece no cliente, sem
 * navegação — o `ActiveSkuProvider` só passa a exibir outro SKU e atualiza a URL
 * com `history.replaceState`.
 *
 * No display `color` mostra o swatch (imagem do catálogo ou cor resolvida) e o
 * texto vira `aria-label` — se a cor não puder ser inferida, o chip volta ao
 * modo texto para nunca exibir uma bolinha vazia.
 */
function SkuOptionChip({
  option,
  dimensionName,
  display,
  onSelect,
}: SkuOptionChipProps) {
  const hasSwatch =
    display === 'color' && Boolean(option.swatchImage ?? option.swatchColor)

  const className = [
    styles.skuOptionChip,
    hasSwatch ? styles['skuOptionChip--swatch'] : styles['skuOptionChip--text'],
    option.selected ? styles['skuOptionChip--selected'] : '',
    option.available ? '' : styles['skuOptionChip--unavailable'],
  ]
    .filter(Boolean)
    .join(' ')

  const content = hasSwatch ? (
    <span
      className={styles.skuOptionChip__swatch}
      style={
        option.swatchImage
          ? { backgroundImage: `url(${option.swatchImage})` }
          : { backgroundColor: option.swatchColor }
      }
    />
  ) : (
    <span>{option.label}</span>
  )

  return (
    <button
      type="button"
      className={className}
      onClick={() => onSelect(option.value)}
      aria-pressed={option.selected}
      aria-label={`${dimensionName}: ${option.label}`}
      title={
        option.available
          ? hasSwatch
            ? option.label
            : undefined
          : `${dimensionName}: ${option.label} sem estoque`
      }
    >
      {content}
    </button>
  )
}

export default SkuOptionChip
