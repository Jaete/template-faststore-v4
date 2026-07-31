import type { FocusEvent, KeyboardEvent } from 'react'
import { useState } from 'react'

import type { PriceRangeFacetProps } from './PriceRangeFacet.types'

export function commitOnEnter(event: KeyboardEvent<HTMLInputElement>) {
  if (event.key === 'Enter') {
    event.currentTarget.blur()
  }
}

/**
 * Sincroniza o input de texto com o valor selecionado enquanto o usuário não está
 * editando — evita sobrescrever o que ele está digitando.
 * Precisa reagir tanto ao `selected` quanto ao `absolute`: quando OUTRO filtro
 * muda o conjunto de produtos exibidos, a API recalcula o range e o
 * `absolute` (min/max possíveis) muda mesmo que o usuário não tenha mexido no
 * preço — então o campo tem que refletir o novo mínimo/máximo. Comparar só
 * `selected` deixava os inputs presos no valor antigo quando só o `absolute`
 * mudava. A sincronização acontece durante o render (sem efeito), no padrão
 * oficial do React de "ajustar state durante o render".
 */
function useSyncedRangeInput(absolute: number, selected: number) {
  const [input, setInput] = useState(String(selected))
  const [isEditing, setIsEditing] = useState(false)
  const [rendered, setRendered] = useState(() => `${absolute}:${selected}`)

  const current = `${absolute}:${selected}`
  if (!isEditing && current !== rendered) {
    setRendered(current)
    setInput(String(selected))
  }

  return { input, setInput, isEditing, setIsEditing }
}

export function usePriceRangeFacet({
  facet,
  selected,
  onChange,
}: PriceRangeFacetProps) {
  // Sem faixa escolhida, a barra fica cheia = limites absolutos do catálogo.
  const selectedMin = selected ? selected.min : facet.min.absolute
  const selectedMax = selected ? selected.max : facet.max.absolute

  const {
    input: minInput,
    setInput: setMinInput,
    setIsEditing: setIsEditingMin,
  } = useSyncedRangeInput(facet.min.absolute, selectedMin)

  const {
    input: maxInput,
    setInput: setMaxInput,
    setIsEditing: setIsEditingMax,
  } = useSyncedRangeInput(facet.max.absolute, selectedMax)

  const handleMinFocus = () => setIsEditingMin(true)
  const handleMaxFocus = () => setIsEditingMax(true)

  const handleMinInputChange = (event: FocusEvent<HTMLInputElement>) =>
    setMinInput(event.target.value)

  const handleMaxInputChange = (event: FocusEvent<HTMLInputElement>) =>
    setMaxInput(event.target.value)

  const handleMinBlur = (event: FocusEvent<HTMLInputElement>) => {
    setIsEditingMin(false)

    const parsed = Number(event.target.value)
    if (Number.isNaN(parsed)) {
      setMinInput(String(selectedMin))
      return
    }

    const clamped = Math.min(Math.max(parsed, facet.min.absolute), selectedMax)

    setMinInput(String(clamped))
    if (clamped !== selectedMin) {
      onChange({ min: clamped, max: selectedMax })
    }
  }

  const handleMaxBlur = (event: FocusEvent<HTMLInputElement>) => {
    setIsEditingMax(false)

    const parsed = Number(event.target.value)
    if (Number.isNaN(parsed)) {
      setMaxInput(String(selectedMax))
      return
    }

    const clamped = Math.max(Math.min(parsed, facet.max.absolute), selectedMin)

    setMaxInput(String(clamped))
    if (clamped !== selectedMax) {
      onChange({ min: selectedMin, max: clamped })
    }
  }

  return {
    selectedMin,
    selectedMax,
    minInput,
    maxInput,
    handleMinFocus,
    handleMaxFocus,
    handleMinInputChange,
    handleMaxInputChange,
    handleMinBlur,
    handleMaxBlur,
  }
}
