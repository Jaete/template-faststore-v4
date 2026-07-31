export interface ColorPaletteItem {
  name: string
  hex?: string
  image?: string
}

export interface ColorPaletteProps {
  colors?: ColorPaletteItem[]
  /** Injected by FastStore RenderSections when present in CMS section data. */
  skipLazyLoadingSection?: boolean
}

export interface ColorPaletteEntry {
  hex?: string
  image?: string
}

/** Normalized name → swatch data from CMS. */
export type ColorPaletteMap = Record<string, ColorPaletteEntry>

export interface ColorSwatch {
  hexColor?: string
  src?: string
}
