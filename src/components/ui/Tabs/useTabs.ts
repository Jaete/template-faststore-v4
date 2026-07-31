import { useCallback, useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'

import type { TabItem, TabsProps } from './Tabs.types'

type UseTabsParams = Pick<
  TabsProps,
  'tabs' | 'initialActiveId' | 'activeId' | 'onActiveIdChange'
>

export function useTabs({
  tabs,
  initialActiveId,
  activeId: controlledActiveId,
  onActiveIdChange,
}: UseTabsParams) {
  const [uncontrolledActiveId, setUncontrolledActiveId] = useState(
    initialActiveId ?? tabs[0]?.id
  )

  const isControlled = controlledActiveId !== undefined
  const activeId = isControlled ? controlledActiveId : uncontrolledActiveId

  const selectTab = useCallback(
    (id: string) => {
      if (!isControlled) {
        setUncontrolledActiveId(id)
      }

      onActiveIdChange?.(id)
    },
    [isControlled, onActiveIdChange]
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
        return
      }

      event.preventDefault()

      const lastIndex = tabs.length - 1
      const nextIndex =
        event.key === 'ArrowRight'
          ? index < lastIndex
            ? index + 1
            : 0
          : index > 0
            ? index - 1
            : lastIndex

      const nextTab = tabs[nextIndex]

      selectTab(nextTab.id)
      document.getElementById(`tab-${nextTab.id}`)?.focus()
    },
    [selectTab, tabs]
  )

  const activeTab = useMemo<TabItem | undefined>(
    () => tabs.find((tab) => tab.id === activeId),
    [tabs, activeId]
  )

  const isActive = useCallback((id: string) => id === activeId, [activeId])

  return { activeTab, isActive, selectTab, handleKeyDown }
}
