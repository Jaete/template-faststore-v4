import type { ChangeEvent } from 'react'
import { useState } from 'react'

import type { RangeSliderProps } from './RangeSlider.types'

/**
 * Sincroniza com props externas durante o render (sem efeito) quando o valor
 * confirmado OU os limites absolutos mudam por fora (ex.: outro filtro
 * recalcula o range de preço dos produtos exibidos) — evita piscar o valor
 * antigo e mantém os thumbs dentro dos novos limites. Precisa reagir a
 * min/max também, senão a régua fica presa no range anterior quando só os
 * limites mudam sem o valor confirmado mexer.
 */
export function useRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  step = 1,
  onChangeEnd,
}: RangeSliderProps) {
  const [localMin, setLocalMin] = useState(valueMin)
  const [localMax, setLocalMax] = useState(valueMax)

  const [renderedValueMin, setRenderedValueMin] = useState(valueMin)
  const [renderedValueMax, setRenderedValueMax] = useState(valueMax)
  const [renderedMin, setRenderedMin] = useState(min)
  const [renderedMax, setRenderedMax] = useState(max)

  if (valueMin !== renderedValueMin || min !== renderedMin) {
    setRenderedValueMin(valueMin)
    setRenderedMin(min)
    setLocalMin(Math.min(Math.max(valueMin, min), max))
  }

  if (valueMax !== renderedValueMax || max !== renderedMax) {
    setRenderedValueMax(valueMax)
    setRenderedMax(max)
    setLocalMax(Math.max(Math.min(valueMax, max), min))
  }

  const range = max - min || 1
  const minPercent = ((localMin - min) / range) * 100
  const maxPercent = ((localMax - min) / range) * 100

  const commit = () => {
    if (localMin !== valueMin || localMax !== valueMax) {
      onChangeEnd({ min: localMin, max: localMax })
    }
  }

  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) =>
    setLocalMin(Math.min(Number(event.target.value), localMax - step))

  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) =>
    setLocalMax(Math.max(Number(event.target.value), localMin + step))

  return {
    localMin,
    localMax,
    minPercent,
    maxPercent,
    commit,
    handleMinChange,
    handleMaxChange,
  }
}
