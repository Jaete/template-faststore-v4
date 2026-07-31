import { useCallback, useEffect, useState } from 'react'

interface UseSlideshowParams {
  itemCount: number
  autoplayInterval?: number
}

export function useSlideshow({
  itemCount,
  autoplayInterval,
}: UseSlideshowParams) {
  const [activeIndex, setActiveIndex] = useState(0)
  const lastIndex = Math.max(itemCount - 1, 0)

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(Math.min(Math.max(index, 0), lastIndex))
    },
    [lastIndex]
  )

  const next = useCallback(() => {
    setActiveIndex((index) => (index >= lastIndex ? 0 : index + 1))
  }, [lastIndex])

  const prev = useCallback(() => {
    setActiveIndex((index) => (index <= 0 ? lastIndex : index - 1))
  }, [lastIndex])

  useEffect(() => {
    if (!autoplayInterval || itemCount <= 1) {
      return
    }

    const intervalId = setInterval(next, autoplayInterval)

    return () => clearInterval(intervalId)
  }, [autoplayInterval, itemCount, next])

  return { activeIndex, goTo, next, prev }
}
