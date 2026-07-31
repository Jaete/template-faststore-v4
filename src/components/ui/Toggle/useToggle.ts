import { useState } from 'react'

interface UseToggleParams {
  on?: boolean
  defaultOn?: boolean
  onToggle: (isOn: boolean) => void
}

/** Gerencia o estado on/off do Toggle, suportando modo controlado e não-controlado */
export function useToggle({
  on,
  defaultOn = false,
  onToggle,
}: UseToggleParams) {
  const isControlled = on !== undefined
  const [internalOn, setInternalOn] = useState(defaultOn)
  const isOn = isControlled ? on : internalOn

  const toggle = () => {
    const next = !isOn

    if (!isControlled) {
      setInternalOn(next)
    }

    onToggle(next)
  }

  return { isOn, toggle }
}
