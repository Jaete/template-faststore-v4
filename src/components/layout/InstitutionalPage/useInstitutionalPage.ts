import { useState } from 'react'

interface UseInstitutionalPageParams {
  itemsCount: number
}

export function useInstitutionalPage({
  itemsCount,
}: UseInstitutionalPageParams) {
  const [activeIndex, setActiveIndex] = useState(0)

  const selectItem = (index: number) => {
    if (index >= 0 && index < itemsCount) {
      setActiveIndex(index)
    }
  }

  return { activeIndex, selectItem }
}
