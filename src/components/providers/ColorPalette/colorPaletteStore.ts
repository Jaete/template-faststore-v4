import type { ColorPaletteMap } from './ColorPalette.types'

const EMPTY_PALETTE: ColorPaletteMap = Object.freeze({})

let paletteSnapshot: ColorPaletteMap = EMPTY_PALETTE
const listeners = new Set<() => void>()

export function setColorPalette(next: ColorPaletteMap) {
  paletteSnapshot = Object.keys(next).length ? next : EMPTY_PALETTE
  listeners.forEach((listener) => listener())
}

export function getColorPaletteSnapshot() {
  return paletteSnapshot
}

export function getServerColorPaletteSnapshot() {
  return EMPTY_PALETTE
}

export function subscribeColorPalette(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
