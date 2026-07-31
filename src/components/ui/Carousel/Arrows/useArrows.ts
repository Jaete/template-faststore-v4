import { useCallback } from 'react'

import { useOverflow } from '../../../../hooks/useOverflow'
import type { ArrowsProps } from './Arrows.types'

type UseArrowsParams = Required<
  Pick<
    ArrowsProps,
    | 'containerRef'
    | 'activeIndex'
    | 'itemCount'
    | 'onActiveIndexChange'
    | 'loop'
  >
> &
  Pick<ArrowsProps, 'orientation'>

export function useArrows({
  containerRef,
  activeIndex,
  itemCount,
  onActiveIndexChange,
  loop,
  orientation = 'horizontal',
}: UseArrowsParams) {
  const hasOverflow = useOverflow(containerRef, [itemCount], orientation)
  const lastIndex = Math.max(itemCount - 1, 0)

  const goToPrevious = useCallback(() => {
    onActiveIndexChange(
      activeIndex > 0 ? activeIndex - 1 : loop ? lastIndex : 0
    )
  }, [activeIndex, lastIndex, loop, onActiveIndexChange])

  const goToNext = useCallback(() => {
    onActiveIndexChange(
      activeIndex < lastIndex ? activeIndex + 1 : loop ? 0 : lastIndex
    )
  }, [activeIndex, lastIndex, loop, onActiveIndexChange])

  return {
    hasOverflow,
    canGoPrevious: loop || activeIndex > 0,
    canGoNext: loop || activeIndex < lastIndex,
    goToPrevious,
    goToNext,
  }
}
