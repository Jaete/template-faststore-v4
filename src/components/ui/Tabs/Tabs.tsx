import type { TabsProps } from './Tabs.types'
import { useTabs } from './useTabs'
import styles from './Tabs.module.scss'

function Tabs({
  tabs,
  initialActiveId,
  activeId,
  onActiveIdChange,
  keepMounted = false,
  className,
}: TabsProps) {
  const { activeTab, isActive, selectTab, handleKeyDown } = useTabs({
    tabs,
    initialActiveId,
    activeId,
    onActiveIdChange,
  })

  if (!tabs?.length) {
    return null
  }

  return (
    <div className={className ? `${styles.tabs} ${className}` : styles.tabs}>
      <div className={styles.tabs__list} role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive(tab.id)}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isActive(tab.id) ? 0 : -1}
            className={
              isActive(tab.id)
                ? `${styles.tabs__tab} ${styles['tabs__tab--active']}`
                : styles.tabs__tab
            }
            onClick={() => selectTab(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span className={styles.tabs__divider} />
            <span className={styles.tabs__label}>{tab.label}</span>
          </button>
        ))}
      </div>

      {keepMounted
        ? tabs.map((tab) => (
            <div
              key={tab.id}
              role="tabpanel"
              id={`tabpanel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              hidden={!isActive(tab.id)}
              className={styles.tabs__panel}
            >
              {tab.content}
            </div>
          ))
        : activeTab && (
            <div
              key={activeTab.id}
              role="tabpanel"
              id={`tabpanel-${activeTab.id}`}
              aria-labelledby={`tab-${activeTab.id}`}
              className={styles.tabs__panel}
            >
              {activeTab.content}
            </div>
          )}
    </div>
  )
}

export default Tabs
