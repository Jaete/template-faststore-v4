import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import type { DropdownOption } from './Dropdown.types'

interface UseDropdownParams {
  options: DropdownOption[]
  onSelected: (option: DropdownOption) => void
  value?: string
  defaultValue?: string
  id?: string
}

/** Próximo índice habilitado a partir de `from`, com wrap e pulando opções desabilitadas */
function getEnabledIndex(
  options: DropdownOption[],
  from: number,
  direction: 1 | -1
): number {
  const total = options.length
  if (total === 0) {
    return -1
  }

  let index = from
  for (let step = 0; step < total; step++) {
    index = (index + direction + total) % total
    if (!options[index].disabled) {
      return index
    }
  }

  return -1
}

/** Encapsula estado, navegação por teclado e acessibilidade do Dropdown */
export function useDropdown({
  options,
  onSelected,
  value,
  defaultValue,
  id,
}: UseDropdownParams) {
  const reactId = useId()
  const baseId = id ?? reactId
  const listboxId = `${baseId}-listbox`

  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const selectedValue = isControlled ? value : internalValue

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue]
  )

  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLLIElement | null>>([])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && activeIndex >= 0) {
      optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [isOpen, activeIndex])

  const open = () => {
    const selectedIndex = options.findIndex(
      (option) => option.value === selectedValue
    )

    setActiveIndex(
      selectedIndex >= 0 ? selectedIndex : getEnabledIndex(options, -1, 1)
    )
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  const toggle = () => (isOpen ? setIsOpen(false) : open())

  const selectOption = (option: DropdownOption) => {
    if (option.disabled) {
      return
    }

    if (!isControlled) {
      setInternalValue(option.value)
    }

    onSelected(option)
    close()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault()
        if (!isOpen) {
          open()

          return
        }
        setActiveIndex((current) =>
          getEnabledIndex(options, current, event.key === 'ArrowDown' ? 1 : -1)
        )
        break
      }

      case 'Home':
      case 'End': {
        if (!isOpen) {
          return
        }
        event.preventDefault()
        setActiveIndex(
          event.key === 'Home'
            ? getEnabledIndex(options, -1, 1)
            : getEnabledIndex(options, 0, -1)
        )
        break
      }

      case 'Enter':
      case ' ': {
        event.preventDefault()
        if (!isOpen) {
          open()

          return
        }
        if (activeIndex >= 0) {
          selectOption(options[activeIndex])
        }
        break
      }

      case 'Escape': {
        if (isOpen) {
          event.preventDefault()
          close()
        }
        break
      }

      case 'Tab': {
        if (isOpen) {
          setIsOpen(false)
        }
        break
      }

      default:
        break
    }
  }

  const getOptionId = (index: number) => `${baseId}-option-${index}`
  const activeOptionId =
    isOpen && activeIndex >= 0 ? getOptionId(activeIndex) : undefined

  return {
    isOpen,
    activeIndex,
    selectedValue,
    selectedOption,
    listboxId,
    activeOptionId,
    containerRef,
    triggerRef,
    optionRefs,
    getOptionId,
    toggle,
    selectOption,
    setActiveIndex,
    handleKeyDown,
  }
}
