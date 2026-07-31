import { useCallback } from 'react'
import type { MutableRefObject, Ref, RefCallback } from 'react'

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (!ref) {
    return
  }

  if (typeof ref === 'function') {
    ref(node)
  } else {
    ;(ref as MutableRefObject<T | null>).current = node
  }
}

/** Combina dois refs (callback ou objeto) num único callback ref estável. */
export function useMergedRef<T>(
  refA: Ref<T> | undefined,
  refB: Ref<T> | undefined
): RefCallback<T> {
  return useCallback(
    (node: T | null) => {
      assignRef(refA, node)
      assignRef(refB, node)
    },
    [refA, refB]
  )
}
