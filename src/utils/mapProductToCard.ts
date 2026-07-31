import type { ProductSummary_ProductFragment } from '@generated/graphql'

import { resolveSlugForVariantValue } from './skuVariants'
import { resolveColorSwatch } from '../components/providers/ColorPalette/colorPaletteMap'
import type { ColorPaletteMap } from '../components/providers/ColorPalette/ColorPalette.types'

import type {
  ProductCardColorOption,
  ProductCardData,
} from '../components/commerce/ProductCard/ProductCard.types'
import type { SkuVariation } from '../types/faststore-custom'

/** Nome da dimensão de variação tratada como seletor de cor no card. */
const COLOR_DIMENSION_PATTERN = /cor|color/i

/**
 * Seletor de cor do card só se aplica quando a única dimensão de variação do
 * produto é uma cor — qualquer outro SKU (tamanho, voltagem, etc.), sozinho
 * ou combinado com cor, desabilita o seletor.
 */
export function buildColorOptions(
  product: ProductSummary_ProductFragment,
  palette: ColorPaletteMap
): ProductCardColorOption[] | undefined {
  const skuVariants = product.isVariantOf?.skuVariants

  if (!skuVariants) {
    return undefined
  }

  const dimensionNames = Object.keys(skuVariants.availableVariations ?? {})

  if (dimensionNames.length !== 1) {
    return undefined
  }

  const [dimensionName] = dimensionNames

  if (!COLOR_DIMENSION_PATTERN.test(dimensionName)) {
    return undefined
  }

  const activeValue = skuVariants.activeVariations?.[dimensionName]

  return skuVariants.availableVariations[dimensionName].map(
    (variation: SkuVariation) => {
      const slug = resolveSlugForVariantValue(
        skuVariants.slugsMap,
        dimensionName,
        variation.value
      )

      const swatch = resolveColorSwatch(variation.label, palette)

      return {
        label: variation.label,
        value: variation.value,
        hex: swatch.hexColor,
        src: swatch.src ?? (swatch.hexColor ? undefined : variation.src),
        href: slug ? `/${slug}/p` : undefined,
        selected: variation.value === activeValue,
        isWhite: swatch.hexColor?.toUpperCase() === '#FFFFFF',
      }
    }
  )
}

export function mapProductToCard(
  product: ProductSummary_ProductFragment,
  palette: ColorPaletteMap
): ProductCardData {
  const [image] = product.image
  const [offer] = product.offers.offers

  return {
    image: {
      src: image?.url ?? '',
      alt: image?.alternateName ?? product.name,
    },
    name: product.name,
    href: `/${product.slug}/p`,
    listPrice: offer?.listPrice ?? 0,
    sellingPrice: offer?.price ?? 0,
    colors: buildColorOptions(product, palette),
  }
}
