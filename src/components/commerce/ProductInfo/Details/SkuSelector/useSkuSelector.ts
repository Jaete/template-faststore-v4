import { useMemo } from 'react'

import { useColorPalette } from '../../../../providers/ColorPalette/useColorPalette'
import { resolveColorSwatch } from '../../../../providers/ColorPalette/colorPaletteMap'
import {
  findBestVariantForValue,
  isVariantInStock,
} from '../../../../../utils/skuVariants'

import type {
  SkuDimension,
  SkuOption,
  SkuVariantDisplay,
  SkuVariantsData,
  SkuVariantForStock,
} from './SkuSelector.types'

/** Dimensões renderizadas como swatch de cor quando nada é passado via prop. */
const DEFAULT_COLOR_DIMENSIONS = ['cor']
/** Constante de módulo para o default não invalidar o `useMemo` a cada render. */
const NO_HIDDEN_DIMENSIONS: string[] = []

interface UseSkuSelectorParams {
  skuVariants?: SkuVariantsData | null
  /**
   * Todos os SKUs do grupo (`allVariantProducts`). É a fonte do ESTOQUE de cada
   * opção — o `slugsMap` só sabe dizer se um combo existe, não se tem saldo.
   */
  variants?: readonly SkuVariantForStock[] | null
  /**
   * Variações do SKU exibido, vindas do `ActiveSkuProvider`. Precisa vir do
   * contexto — e NÃO de `skuVariants.activeVariations`, que descreve o SKU do SSR
   * e ficaria congelado, fazendo o segundo clique perder a primeira escolha.
   */
  activeVariations: Record<string, string>
  /**
   * `true` enquanto `allVariantProducts` não chegou. Nesse intervalo não há como
   * saber o estoque, então os chips nascem TODOS disponíveis — o contrário
   * (todos riscados por meio segundo) seria pior que otimismo momentâneo.
   */
  isVariantsPending: boolean
  colorDimensions?: string[]
  hiddenDimensions?: string[]
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

/**
 * Remove o prefixo do nome da dimensão do label da variação.
 *
 * O core formata o label como `"${nome}: ${valor}"` (ver `getFormattedVariations`
 * em `@faststore/api`), mas no chip o nome já aparece no rótulo do grupo. Se o
 * label não vier nesse formato, cai para o próprio valor da variação.
 */
function stripDimensionPrefix(
  label: string,
  dimensionName: string,
  value: string
) {
  const prefix = `${dimensionName}:`

  if (label.trim().toLowerCase().startsWith(prefix.toLowerCase())) {
    return label.trim().slice(prefix.length).trim()
  }

  return label || value
}

/**
 * Deriva as dimensões de variação do produto da PDP a partir de
 * `isVariantOf.skuVariants`.
 *
 * Todo VALOR do catálogo aparece como chip — nenhuma dimensão filtra a outra.
 * `available` de cada opção NÃO significa "combo existe" (isso o catálogo já
 * garante: `availableVariations` só lista valores reais); significa **tem
 * estoque**. É por isso que o chip riscado no Figma passou a significar "sem
 * estoque" em vez de "essa combinação não existe".
 *
 * O estoque é resolvido com `findBestVariantForValue`, o MESMO helper do
 * fallback de clique em `ActiveSkuProvider.selectVariation` — ignora a própria
 * dimensão e busca, entre os SKUs com aquele valor, o que mais combina com a
 * seleção atual das outras. Assim o chip riscado é sempre coerente com o SKU
 * que o clique de fato abriria.
 */
export function useSkuSelector({
  skuVariants,
  variants,
  activeVariations,
  isVariantsPending,
  colorDimensions = DEFAULT_COLOR_DIMENSIONS,
  hiddenDimensions = NO_HIDDEN_DIMENSIONS,
}: UseSkuSelectorParams): SkuDimension[] {
  const palette = useColorPalette()

  return useMemo(() => {
    const available = skuVariants?.availableVariations

    if (!available) {
      return []
    }

    const active = activeVariations
    const dimensionNames = Object.keys(available)
    const colorSet = new Set(colorDimensions.map(normalize))
    const hiddenSet = new Set(hiddenDimensions.map(normalize))

    // Dimensões escondidas continuam entrando no combo de resolução — só não
    // viram seletor visível.
    const visibleEntries = Object.entries(available).filter(
      ([name, variations]) =>
        // Dimensão com um único valor não é escolha — não vira seletor.
        !hiddenSet.has(normalize(name)) && variations?.length > 1
    )

    return visibleEntries.map(([name, variations]) => {
      const display: SkuVariantDisplay = colorSet.has(normalize(name))
        ? 'color'
        : 'text'
      const selectedValue = active[name]

      const options: SkuOption[] = variations.map((variation) => {
        const swatch =
          display === 'color'
            ? resolveColorSwatch(variation.label, palette)
            : undefined

        // Sem os variantes ainda (SSR puro), não há como responder estoque —
        // otimista: todo chip nasce disponível em vez de todos riscados.
        const isAvailable = isVariantsPending
          ? true
          : isVariantInStock(
              findBestVariantForValue(
                variants ?? [],
                dimensionNames,
                active,
                name,
                variation.value
              )
            )

        return {
          value: variation.value,
          // O core formata o label como "TAMANHO: 180 cm"; no chip o nome da
          // dimensão já está no rótulo do grupo, então fica só o valor.
          label: stripDimensionPrefix(variation.label, name, variation.value),
          selected: variation.value === selectedValue,
          available: isAvailable,
          // Cor solida cadastrada no CMS (ColorPalette) tem prioridade; só cai
          // pro SVG/imagem do catálogo quando a paleta não resolveu NADA (nem
          // hex nem imagem) — senão um hex cadastrado nunca apareceria, já que
          // o chip prioriza swatchImage sobre swatchColor.
          swatchColor: swatch?.hexColor,
          swatchImage:
            display === 'color'
              ? (swatch?.src ?? (swatch?.hexColor ? undefined : variation.src))
              : undefined,
        }
      })

      return {
        name,
        label: name,
        display,
        selectedValue,
        options,
      }
    })
  }, [
    skuVariants,
    variants,
    activeVariations,
    isVariantsPending,
    colorDimensions,
    hiddenDimensions,
    palette,
  ])
}
