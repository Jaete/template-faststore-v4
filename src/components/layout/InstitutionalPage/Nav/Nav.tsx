import Dropdown from '../../../ui/Dropdown/Dropdown'
import type { DropdownOption } from '../../../ui/Dropdown/Dropdown.types'
import type { NavProps } from './Nav.types'
import styles from '../InstitutionalPage.module.scss'

function Nav({ groups, groupStarts, activeIndex, onSelect }: NavProps) {
  const dropdownOptions: DropdownOption[] = groups.flatMap(
    (group, groupIndex) => {
      const groupStart = groupStarts[groupIndex]

      return [
        { label: group.title, value: `group-${groupStart}`, disabled: true },
        ...group.items.map((item, index) => ({
          label: item.label,
          value: String(groupStart + index),
        })),
      ]
    }
  )

  return (
    <>
      <nav
        className={styles.institutionalPage__navDesktop}
        aria-label="Navegação institucional"
      >
        {groups.map((group, groupIndex) => {
          const groupStart = groupStarts[groupIndex]

          return (
            <div
              key={`${group.title}-${groupStart}`}
              className={styles.institutionalPage__group}
            >
              <span className={styles.institutionalPage__groupTitle}>
                {group.title}
              </span>

              <ul className={styles.institutionalPage__list}>
                {group.items.map((item, index) => {
                  const itemIndex = groupStart + index
                  const isActive = itemIndex === activeIndex

                  return (
                    <li key={itemIndex}>
                      <button
                        type="button"
                        className={[
                          styles.institutionalPage__link,
                          isActive
                            ? styles['institutionalPage__link--active']
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        aria-current={isActive || undefined}
                        onClick={() => onSelect(itemIndex)}
                      >
                        {item.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>

      <div className={styles.institutionalPage__navMobile}>
        <Dropdown
          aria-label="Navegação institucional"
          options={dropdownOptions}
          value={String(activeIndex)}
          onSelected={(option) => onSelect(Number(option.value))}
        />
      </div>
    </>
  )
}

export default Nav
