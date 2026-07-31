import clsx from 'clsx'
import { useMemo, useRef, useState } from 'react'

import Carousel from '../../ui/Carousel/Carousel'
import CarouselArrows from '../../ui/Carousel/Arrows/Arrows'
import Dropdown from '../../ui/Dropdown/Dropdown'
import type { DropdownOption } from '../../ui/Dropdown/Dropdown.types'
import { useModelQuickFilter } from './useModelQuickFilter'
import type {
  ModelQuickFilterChip,
  ModelQuickFilterProps,
} from './ModelQuickFilter.types'
import styles from './ModelQuickFilter.module.scss'

// Value sentinela da opção de reset. Não é um índice válido de `chips`
// (sempre >= 0), então nunca colide com uma opção real.
const CLEAR_OPTION_VALUE = '__all__'

function ModelQuickFilter({
  show = true,
  title,
  facetKey,
  clearOptionLabel = 'Todos',
  placeholder = 'Selecione',
  showArrows,
}: ModelQuickFilterProps) {
  const { chips, onToggle, selectedChip, onSelectExclusive, onClear } =
    useModelQuickFilter({ facetKey })
  const containerRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Opções do dropdown mobile: a opção de reset no topo + um item por chip.
  // O value é o índice do chip em `chips` — evita concatenar key/value com um
  // delimitador que poderia colidir com o conteúdo de um facet value.
  const dropdownOptions = useMemo<DropdownOption[]>(
    () => [
      { label: clearOptionLabel, value: CLEAR_OPTION_VALUE },
      ...chips.map((chip, index) => ({
        label: chip.label,
        value: String(index),
      })),
    ],
    [chips, clearOptionLabel]
  )

  // Sem chip ativo, o item de reset fica selecionado (trigger mostra o texto de
  // reset em vez do placeholder).
  const selectedChipIndex = selectedChip ? chips.indexOf(selectedChip) : -1
  const selectedValue =
    selectedChipIndex >= 0 ? String(selectedChipIndex) : CLEAR_OPTION_VALUE

  if (!show || !chips.length) {
    return null
  }

  return (
    <div className={styles.modelQuickFilter}>
      {title && <h3 className={styles.modelQuickFilter__title}>{title}</h3>}

      <div className={styles.modelQuickFilter__carousel}>
        <Carousel<ModelQuickFilterChip>
          as="ul"
          items={chips}
          getItemKey={(chip) => `${chip.key}:${chip.value}`}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          containerRef={containerRef}
          className={styles.modelQuickFilter__track}
          renderItem={(chip) => (
            <button
              type="button"
              className={clsx(
                styles.modelQuickFilter__chip,
                chip.selected && styles['modelQuickFilter__chip--selected']
              )}
              aria-pressed={chip.selected}
              onClick={() => onToggle(chip.key, chip.value)}
            >
              {chip.label}
            </button>
          )}
        />

        {(showArrows?.desktop ?? true) && (
          <CarouselArrows
            containerRef={containerRef}
            activeIndex={activeIndex}
            itemCount={chips.length}
            onActiveIndexChange={setActiveIndex}
            variant="plain"
            className={styles.modelQuickFilter__arrows}
          />
        )}
      </div>

      <div className={styles.modelQuickFilter__dropdown}>
        <Dropdown
          options={dropdownOptions}
          value={selectedValue}
          placeholder={placeholder}
          aria-label={title ?? clearOptionLabel}
          onSelected={(option) => {
            if (option.value === CLEAR_OPTION_VALUE) {
              onClear()
              return
            }

            const chip = chips[Number(option.value)]
            if (chip) {
              onSelectExclusive(chip.key, chip.value)
            }
          }}
        />
      </div>
    </div>
  )
}

export default ModelQuickFilter
