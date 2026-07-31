import { useLayoutEffect, useMemo } from 'react'

import { buildColorPaletteMap } from './colorPaletteMap'
import { setColorPalette } from './colorPaletteStore'
import type { ColorPaletteProps } from './ColorPalette.types'

/**
 * CMS section (Global Sections): publishes the store color map once per page.
 * Renders nothing — consumers read via `useColorPalette()`.
 *
 * Keep `skipLazyLoadingSection: true` in CMS so the map is available before the PLP.
 */
function ColorPalette({ colors }: ColorPaletteProps) {
  const map = useMemo(() => buildColorPaletteMap(colors), [colors])

  useLayoutEffect(() => {
    setColorPalette(map)
    return () => setColorPalette({})
  }, [map])

  return null
}

export default ColorPalette
