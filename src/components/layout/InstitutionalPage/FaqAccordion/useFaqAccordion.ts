import { useState } from 'react'

interface UseFaqAccordionParams {
  itemsCount: number
}

export function useFaqAccordion({ itemsCount }: UseFaqAccordionParams) {
  const [openIndex, setOpenIndex] = useState(itemsCount > 0 ? 0 : -1)

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? -1 : index))
  }

  return { openIndex, toggle }
}
