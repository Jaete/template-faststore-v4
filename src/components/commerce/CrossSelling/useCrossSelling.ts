import { useCallback, useMemo, useState } from 'react'

import { usePDP } from 'src/sdk/overrides/PageProvider'
import { cartStore } from 'src/sdk/cart'

import { dispatch, EventName } from '../../../utils/events'
import type { CrossSellingItem } from './CrossSelling.types'

interface CrossSellingOffer {
  price: number
  listPrice: number
  availability: string
  quantity: number
  seller: { identifier: string }
}

interface CrossSellingProduct {
  sku: string
  slug: string
  name: string
  image: Array<{ url: string; alternateName: string }>
  offers: {
    lowPrice: number
    offers: CrossSellingOffer[]
  }
}

/** Quantidade de slots relacionados exibidos ao mesmo tempo (fora o produto atual). */
const VISIBLE_RELATED_SLOTS = 2

/** Oferta vendável (com estoque) de menor preço, que é a usada no card. */
function findBestOffer(product: CrossSellingProduct) {
  return product.offers.offers.find(
    (offer) =>
      offer.availability === 'https://schema.org/InStock' && offer.quantity > 0
  )
}

function toItem(
  product: CrossSellingProduct,
  offer: CrossSellingOffer,
  isCurrentProduct: boolean
): CrossSellingItem {
  const [image] = product.image

  return {
    id: product.sku,
    name: product.name,
    href: `/${product.slug}/p`,
    image: {
      src: image?.url ?? '',
      alt: image?.alternateName ?? product.name,
    },
    listPrice: offer.listPrice,
    sellingPrice: offer.price,
    isCurrentProduct,
    selected: true,
  }
}

export function useCrossSelling() {
  const product = usePDP()?.data?.product

  const currentItem = useMemo<CrossSellingItem | null>(() => {
    if (!product) {
      return null
    }

    const current = product as unknown as CrossSellingProduct
    const offer = findBestOffer(current)

    return offer ? toItem(current, offer, true) : null
  }, [product])

  /**
   * Pool inteiro de relacionados com oferta vendável — a fonte de onde os
   * slots relacionados sorteiam/ciclam, não o que aparece na tela de uma vez.
   */
  const relatedPool = useMemo<CrossSellingItem[]>(() => {
    if (!product) {
      return []
    }

    const related = (product.crossSellingProducts ??
      []) as unknown as CrossSellingProduct[]

    return related
      .map((item) => {
        const offer = findBestOffer(item)

        return offer ? toItem(item, offer, false) : null
      })
      .filter((item): item is CrossSellingItem => item !== null)
  }, [product])

  /**
   * Um índice (posição no `relatedPool`) por slot visível. Cada clique em
   * "ciclar" avança o índice do slot para o próximo relacionado que não esteja
   * ocupando NENHUM slot no momento; ao esgotar as opções, volta para o índice
   * inicial do slot (o comportamento de "voltar para o início" pedido).
   */
  const [slotIndexes, setSlotIndexes] = useState<number[]>(() =>
    Array.from({ length: VISIBLE_RELATED_SLOTS }, (_, slot) => slot)
  )

  const cycleSlot = useCallback(
    (slot: number) => {
      setSlotIndexes((current) => {
        if (relatedPool.length <= 1) {
          return current
        }

        const initialIndex = slot % relatedPool.length
        const occupiedByOtherSlots = current.filter(
          (_, otherSlot) => otherSlot !== slot
        )

        let candidate = current[slot]

        for (let step = 1; step <= relatedPool.length; step++) {
          const nextIndex = (current[slot] + step) % relatedPool.length

          if (nextIndex === initialIndex) {
            candidate = initialIndex
            break
          }

          if (!occupiedByOtherSlots.includes(nextIndex)) {
            candidate = nextIndex
            break
          }
        }

        const next = [...current]

        next[slot] = candidate

        return next
      })
    },
    [relatedPool.length]
  )

  const relatedSlots = useMemo(
    () =>
      slotIndexes
        .map((index) => relatedPool[index])
        .filter((item): item is CrossSellingItem => Boolean(item)),
    [slotIndexes, relatedPool]
  )

  const [deselectedIds, setDeselectedIds] = useState<string[]>([])

  const toggleItem = useCallback((id: string) => {
    setDeselectedIds((current) =>
      current.includes(id)
        ? current.filter((deselectedId) => deselectedId !== id)
        : [...current, id]
    )
  }, [])

  const items = useMemo(
    () =>
      [currentItem, ...relatedSlots]
        .filter((item): item is CrossSellingItem => item !== null)
        .map((item, index) => ({
          ...item,
          selected: item.isCurrentProduct || !deselectedIds.includes(item.id),
          slot: item.isCurrentProduct ? undefined : index - 1,
        })),
    [currentItem, relatedSlots, deselectedIds]
  )

  const selectedItems = useMemo(
    () => items.filter((item) => item.selected),
    [items]
  )

  const { totalSellingPrice, totalListPrice } = useMemo(
    () =>
      selectedItems.reduce(
        (totals, item) => ({
          totalSellingPrice: totals.totalSellingPrice + item.sellingPrice,
          totalListPrice: totals.totalListPrice + item.listPrice,
        }),
        { totalSellingPrice: 0, totalListPrice: 0 }
      ),
    [selectedItems]
  )

  const addComboToCart = useCallback(() => {
    if (!product || !selectedItems.length) {
      return
    }

    const current = product as unknown as CrossSellingProduct
    const related = (product.crossSellingProducts ??
      []) as unknown as CrossSellingProduct[]

    const bySku = new Map(
      [current, ...related].map((item) => [item.sku, item])
    )

    selectedItems.forEach((item) => {
      const source = bySku.get(item.id)
      const offer = source && findBestOffer(source)

      if (!source || !offer) {
        return
      }

      cartStore.addItem({
        quantity: 1,
        price: offer.price,
        priceWithTaxes: offer.price,
        listPrice: offer.listPrice,
        listPriceWithTaxes: offer.listPrice,
        seller: offer.seller,
        itemOffered: {
          sku: source.sku,
          name: source.name,
          unitMultiplier: null,
          gtin: '',
          image: source.image,
          brand: { name: '' },
          isVariantOf: {
            productGroupID: source.sku,
            name: source.name,
            skuVariants: null,
          },
          additionalProperty: [],
        },
      })
    })

    // `cartStore.addItem` não passa pelo `useBuyButton` do core, então não
    // dispara o analytics `add_to_cart` que o `useMinicart` escuta para abrir
    // o drawer — disparamos o evento de abertura explicitamente.
    dispatch(EventName.OpenCartDrawer)
  }, [product, selectedItems])

  return {
    items,
    toggleItem,
    cycleSlot,
    canCycle: relatedPool.length > VISIBLE_RELATED_SLOTS,
    selectedCount: selectedItems.length,
    totalSellingPrice,
    totalListPrice,
    hasDiscount: totalListPrice > totalSellingPrice,
    addComboToCart,
  }
}
