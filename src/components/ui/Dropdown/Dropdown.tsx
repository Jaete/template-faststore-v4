import { ChevronDownIcon } from '../Icons'

import type { DropdownProps } from './Dropdown.types'
import { useDropdown } from './useDropdown'
import styles from './Dropdown.module.scss'

function Dropdown({
  options,
  onSelected,
  value,
  defaultValue,
  placeholder = 'Selecione',
  prefix,
  disabled = false,
  id,
  className,
  'aria-label': ariaLabel,
}: DropdownProps) {
  const {
    isOpen,
    activeIndex,
    selectedValue,
    selectedOption,
    listboxId,
    activeOptionId,
    containerRef,
    triggerRef,
    optionRefs,
    getOptionId,
    toggle,
    selectOption,
    setActiveIndex,
    handleKeyDown,
  } = useDropdown({ options, onSelected, value, defaultValue, id })

  return (
    <div
      ref={containerRef}
      className={[
        styles.dropdown,
        isOpen ? styles['dropdown--open'] : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        ref={triggerRef}
        type="button"
        className={styles.dropdown__trigger}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        aria-activedescendant={activeOptionId}
        onClick={toggle}
        onKeyDown={handleKeyDown}
      >
        {selectedOption?.swatch && (
          <img
            className={styles.dropdown__swatch}
            src={selectedOption.swatch}
            alt=""
            aria-hidden="true"
          />
        )}
        <span
          className={[
            styles.dropdown__label,
            selectedOption ? '' : styles['dropdown__label--placeholder'],
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {prefix && <span className={styles.dropdown__prefix}>{prefix} </span>}
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDownIcon className={styles.dropdown__arrow} />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          className={styles.dropdown__list}
          aria-activedescendant={activeOptionId}
        >
          {options.length === 0 && (
            <li className={styles.dropdown__empty}>Nenhuma opção disponível</li>
          )}

          {options.map((option, index) => {
            const isSelected = option.value === selectedValue
            const isActive = index === activeIndex

            return (
              <li
                key={option.value}
                ref={(node) => {
                  optionRefs.current[index] = node
                }}
                id={getOptionId(index)}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                className={[
                  styles.dropdown__option,
                  isActive ? styles['dropdown__option--active'] : '',
                  isSelected ? styles['dropdown__option--selected'] : '',
                  option.disabled ? styles['dropdown__option--disabled'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => selectOption(option)}
                onMouseEnter={() => !option.disabled && setActiveIndex(index)}
              >
                {option.swatch && (
                  <img
                    className={styles.dropdown__swatch}
                    src={option.swatch}
                    alt=""
                    aria-hidden="true"
                  />
                )}
                <span className={styles.dropdown__optionLabel}>
                  {option.label}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
