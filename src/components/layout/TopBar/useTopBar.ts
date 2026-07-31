import { useCallback, useEffect, useState } from 'react'

const AUTO_ADVANCE_INTERVAL_MS = 4000

interface UseTopBarParams {
  benefits: string[]
}

/** Encapsula o índice ativo e a navegação do carrossel de benefícios */
export function useTopBar({ benefits }: UseTopBarParams) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const hasMultipleBenefits = benefits.length > 1
  const currentBenefit = benefits[currentIndex]

  const goToPrevious = useCallback(() => {
    setCurrentIndex((index) => (index - 1 + benefits.length) % benefits.length)
  }, [benefits.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((index) => (index + 1) % benefits.length)
  }, [benefits.length])

  useEffect(() => {
    if (!hasMultipleBenefits) {
      return
    }

    const timer = setInterval(goToNext, AUTO_ADVANCE_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [hasMultipleBenefits, currentIndex, goToNext])

  return {
    currentBenefit,
    currentIndex,
    hasMultipleBenefits,
    goToPrevious,
    goToNext,
  }
}
