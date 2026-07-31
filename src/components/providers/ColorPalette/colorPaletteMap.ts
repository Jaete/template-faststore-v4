import type {
  ColorPaletteEntry,
  ColorPaletteItem,
  ColorPaletteMap,
  ColorSwatch,
} from './ColorPalette.types'

export function normalizeColorKey(label: string) {
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

export function buildColorPaletteMap(
  colors: ColorPaletteItem[] | undefined
): ColorPaletteMap {
  const map: ColorPaletteMap = {}

  for (const color of colors ?? []) {
    const name = color?.name?.trim()
    if (!name) continue

    const hex = color.hex?.trim() || undefined
    const image = color.image?.trim() || undefined
    if (!hex && !image) continue

    const entry: ColorPaletteEntry = { hex, image }
    const key = normalizeColorKey(name)
    const compacted = key.replace(/\s+/g, '')

    map[key] = entry
    if (compacted !== key) map[compacted] = entry
  }

  return map
}

function findPaletteEntry(
  label: string,
  palette: ColorPaletteMap
): ColorPaletteEntry | undefined {
  const normalized = normalizeColorKey(label)
  if (!normalized) return undefined

  const compacted = normalized.replace(/\s+/g, '')
  const direct = palette[normalized] ?? palette[compacted]
  if (direct) return direct

  const tokens = normalized.split(' ').filter(Boolean)
  if (tokens.length > 1) {
    for (let len = tokens.length; len >= 1; len--) {
      for (let start = 0; start <= tokens.length - len; start++) {
        const slice = tokens.slice(start, start + len).join(' ')
        const hit = palette[slice] ?? palette[slice.replace(/\s+/g, '')]
        if (hit) return hit
      }
    }
  }

  return undefined
}

/**
 * Resolve swatch from CMS palette. Empty result → caller should fall back
 * to the product image.
 */
export function resolveColorSwatch(
  label: string,
  palette: ColorPaletteMap
): ColorSwatch {
  const entry = findPaletteEntry(label, palette)
  if (!entry) return {}

  if (entry.hex) {
    return { hexColor: entry.hex }
  }

  if (entry.image) {
    return { src: entry.image }
  }

  return {}
}
