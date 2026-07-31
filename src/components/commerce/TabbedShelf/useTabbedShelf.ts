import { useCallback, useMemo, useState } from 'react'
import type { RefObject } from 'react'

import type { ShelfItemsInfo } from '../Shelf/Shelf.types'
import type { TabbedShelfTab } from './TabbedShelf.types'

interface UseTabbedShelfParams {
  tabs: TabbedShelfTab[]
}

interface TabRuntimeState {
  activeIndex: number
  itemsInfo: ShelfItemsInfo
}

const DEFAULT_TAB_STATE: TabRuntimeState = {
  activeIndex: 0,
  itemsInfo: { positionCount: 0, isLoading: true },
}

const EMPTY_CONTAINER_REF: RefObject<HTMLDivElement> = { current: null }

export function useTabbedShelf({ tabs }: UseTabbedShelfParams) {
  const [activeTabId, setActiveTabId] = useState(tabs[0] ? 'tab-0' : undefined)
  const [tabStates, setTabStates] = useState<Record<string, TabRuntimeState>>(
    {}
  )

  // Um container ref por aba — cada Shelf fica sempre montado (só escondido
  // via CSS pelo `Tabs` keepMounted), então a posição do carrossel de cada
  // aba é preservada e o ResizeObserver do CarouselArrows nunca fica
  // observando um node morto. Objetos simples (não `useRef`) recriados só
  // quando a quantidade de abas muda.
  const containerRefs = useMemo(() => {
    const refs = new Map<string, RefObject<HTMLDivElement>>()

    tabs.forEach((_, index) => {
      refs.set(`tab-${index}`, { current: null })
    })

    return refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs.length])

  const getContainerRef = useCallback(
    (tabId: string) => containerRefs.get(tabId) ?? EMPTY_CONTAINER_REF,
    [containerRefs]
  )

  const getTabState = useCallback(
    (tabId: string) => tabStates[tabId] ?? DEFAULT_TAB_STATE,
    [tabStates]
  )

  const setTabActiveIndex = useCallback((tabId: string, index: number) => {
    setTabStates((prev) => ({
      ...prev,
      [tabId]: { ...(prev[tabId] ?? DEFAULT_TAB_STATE), activeIndex: index },
    }))
  }, [])

  const setTabItemsInfo = useCallback(
    (tabId: string, itemsInfo: ShelfItemsInfo) => {
      setTabStates((prev) => ({
        ...prev,
        [tabId]: { ...(prev[tabId] ?? DEFAULT_TAB_STATE), itemsInfo },
      }))
    },
    []
  )

  const activeState = getTabState(activeTabId ?? '')

  return {
    activeTabId,
    setActiveTabId,
    getContainerRef,
    getTabState,
    setTabActiveIndex,
    setTabItemsInfo,
    activeContainerRef: getContainerRef(activeTabId ?? ''),
    activeIndex: activeState.activeIndex,
    itemsInfo: activeState.itemsInfo,
  }
}
