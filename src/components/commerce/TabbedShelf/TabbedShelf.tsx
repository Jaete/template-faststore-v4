import { useMemo } from 'react'

import Tabs from '../../ui/Tabs/Tabs'
import Shelf from '../Shelf/Shelf'
import CarouselArrows from '../../ui/Carousel/Arrows/Arrows'
import PaginationDots from '../../ui/PaginationDots/PaginationDots'
import { useArrows as useCarouselArrows } from '../../ui/Carousel/Arrows/useArrows'
import { useTabbedShelf } from './useTabbedShelf'
import type { TabItem } from '../../ui/Tabs/Tabs.types'
import type { TabbedShelfProps } from './TabbedShelf.types'
import styles from './TabbedShelf.module.scss'
import { renderRichText } from '../../../utils/renderRichText'

function TabbedShelf({ title, visibleItems = 4, tabs }: TabbedShelfProps) {
  const titleHtml = useMemo(() => renderRichText(title), [title])
  const {
    activeTabId,
    setActiveTabId,
    getContainerRef,
    getTabState,
    setTabActiveIndex,
    setTabItemsInfo,
    activeContainerRef,
    activeIndex,
    itemsInfo,
  } = useTabbedShelf({ tabs: tabs ?? [] })

  const handleActiveIndexChange = (nextIndex: number) =>
    setTabActiveIndex(activeTabId ?? '', nextIndex)

  // Reaproveita a lógica das setas (usada no header, no desktop) pra também
  // controlar o par de setas que acompanha os dots no mobile.
  const { hasOverflow: hasMobileOverflow } = useCarouselArrows({
    containerRef: activeContainerRef,
    activeIndex,
    itemCount: itemsInfo.positionCount,
    onActiveIndexChange: handleActiveIndexChange,
    loop: false,
  })

  if (!tabs?.length) {
    return null
  }

  const tabItems: TabItem[] = tabs.map((tab, index) => {
    const id = `tab-${index}`

    return {
      id,
      label: tab.label,
      content: (
        <Shelf
          collectionId={tab.collectionId}
          categoryId={tab.categoryId}
          bestSellers={tab.bestSellers}
          numberOfItems={tab.numberOfItems}
          visibleItems={visibleItems}
          containerRef={getContainerRef(id)}
          activeIndex={getTabState(id).activeIndex}
          onActiveIndexChange={(nextIndex) => setTabActiveIndex(id, nextIndex)}
          onItemsChange={(info) => setTabItemsInfo(id, info)}
          showArrows={false}
          showPaginationDots={false}
        />
      ),
    }
  })

  return (
    <div className={styles.tabbedShelf}>
      <div className={styles.tabbedShelf__header}>
        {titleHtml && (
          <div
            className={styles.tabbedShelf__title}
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />
        )}

        {!itemsInfo.isLoading && (
          <CarouselArrows
            containerRef={activeContainerRef}
            className={styles.tabbedShelf__arrows}
            variant="plain"
            activeIndex={activeIndex}
            itemCount={itemsInfo.positionCount}
            onActiveIndexChange={handleActiveIndexChange}
          />
        )}
      </div>

      <Tabs
        tabs={tabItems}
        activeId={activeTabId}
        onActiveIdChange={setActiveTabId}
        keepMounted
      />

      {!itemsInfo.isLoading && hasMobileOverflow && (
        <div className={styles.tabbedShelf__pagination}>
          <CarouselArrows
            containerRef={activeContainerRef}
            className={styles.tabbedShelf__paginationArrow}
            variant="plain"
            only="previous"
            activeIndex={activeIndex}
            itemCount={itemsInfo.positionCount}
            onActiveIndexChange={handleActiveIndexChange}
          />

          <PaginationDots
            className={styles.tabbedShelf__dots}
            activeIndex={activeIndex}
            itemCount={itemsInfo.positionCount}
            onSelect={handleActiveIndexChange}
          />

          <CarouselArrows
            containerRef={activeContainerRef}
            className={styles.tabbedShelf__paginationArrow}
            variant="plain"
            only="next"
            activeIndex={activeIndex}
            itemCount={itemsInfo.positionCount}
            onActiveIndexChange={handleActiveIndexChange}
          />
        </div>
      )}
    </div>
  )
}

export default TabbedShelf
