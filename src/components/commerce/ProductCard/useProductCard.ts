import { useMemo, useState } from 'react'

import type {
  ProductCardColorOption,
  ProductCardData,
} from './ProductCard.types'

interface UseProductCardParams {
  product?: ProductCardData
  maxVisibleColors: number
}

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function splitVisibleColors(
  colors: ProductCardColorOption[],
  maxVisible: number
) {
  return {
    visibleColors: colors.slice(0, maxVisible),
    hiddenColorsCount: Math.max(colors.length - maxVisible, 0),
  }
}

export function useProductCard({
  product,
  maxVisibleColors,
}: UseProductCardParams) {
  const hasDiscount = product ? product.sellingPrice < product.listPrice : false

  const discountPercentage =
    product && hasDiscount
      ? Math.round((1 - product.sellingPrice / product.listPrice) * 100)
      : 0

  const colors = useMemo(() => product?.colors ?? [], [product])

  /** Cor exibida no card — só muda por clique do usuário, sem navegar para a PDP. */
  const [selectedValue, setSelectedValue] = useState(
    () => colors.find((color) => color.selected)?.value
  )

  // Reseta a seleção quando o slot passa a exibir outro produto — ajuste de
  // estado durante o render, sem efeito, para não piscar a cor antiga.
  const [renderedHref, setRenderedHref] = useState(product?.href)

  if (product?.href !== renderedHref) {
    setRenderedHref(product?.href)
    setSelectedValue(colors.find((color) => color.selected)?.value)
  }

  const selectedColor = colors.find((color) => color.value === selectedValue)

  const { visibleColors, hiddenColorsCount } = useMemo(() => {
    const coloredWithSelection = colors.map((color) => ({
      ...color,
      selected: color.value === selectedValue,
    }))

    return splitVisibleColors(coloredWithSelection, maxVisibleColors)
  }, [colors, maxVisibleColors, selectedValue])

  const image = selectedColor?.src
    ? { src: selectedColor.src, alt: selectedColor.label }
    : product?.image

  const href = selectedColor?.href ?? product?.href

  return {
    hasDiscount,
    discountLabel: `-${discountPercentage}%`,
    formattedListPrice: product ? priceFormatter.format(product.listPrice) : '',
    formattedSellingPrice: product
      ? priceFormatter.format(product.sellingPrice)
      : '',
    visibleColors,
    hiddenColorsCount,
    image,
    href,
    selectColor: setSelectedValue,
  }
}
