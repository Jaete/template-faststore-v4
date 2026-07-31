import { useSyncExternalStore } from 'react'

import {
  getColorPaletteSnapshot,
  getServerColorPaletteSnapshot,
  subscribeColorPalette,
} from './colorPaletteStore'

export function useColorPalette() {
  return useSyncExternalStore(
    subscribeColorPalette,
    getColorPaletteSnapshot,
    getServerColorPaletteSnapshot
  )
}
