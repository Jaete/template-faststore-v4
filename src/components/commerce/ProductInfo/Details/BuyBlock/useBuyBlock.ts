import { useCallback, useMemo, useState } from 'react'

import { usePDP } from 'src/sdk/overrides/PageProvider'
import { cartStore } from 'src/sdk/cart'

import { useActiveSku } from '../../../../providers/ActiveSkuProvider/ActiveSkuProvider'
import { dispatch, EventName } from '../../../../../utils/events'
import { attachmentSelectionToProperties } from '../../../../../utils/skuAttachments'

/**
 * Estado e ação de compra do SKU ativo da PDP.
 *
 * O `CartItem` mistura dados do SKU exibido (`useActiveSku().product`, que só
 * tem a superfície de `allVariantProducts`) com dados do grupo (`usePDP`, que
 * tem `brand` e `isVariantOf.name`) — nenhum dos dois sozinho cobre o shape que
 * `cartStore.addItem` espera.
 */
export function useBuyBlock() {
  const { product, activeSku, activeVariations, attachmentSelection } =
    useActiveSku()
  const groupProduct = usePDP()?.data?.product

  const bestOffer = product?.offers?.offers?.[0]
  const maxQuantity = bestOffer?.quantity

  const [quantity, setQuantity] = useState(1)

  const skuVariants = groupProduct?.isVariantOf?.skuVariants

  // A VTEX rejeita o item no checkout se um anexo `required` não vier
  // preenchido — bloquear aqui evita o erro tardio, no fechamento do pedido.
  const hasMissingRequiredAttachment = useMemo(
    () =>
      (product?.skuAttachments ?? []).some(
        (attachment) =>
          attachment.required && !attachmentSelection[attachment.name]
      ),
    [product?.skuAttachments, attachmentSelection]
  )

  const addToCart = useCallback(() => {
    if (
      !product ||
      !groupProduct ||
      !bestOffer ||
      hasMissingRequiredAttachment
    ) {
      return
    }

    cartStore.addItem({
      quantity,
      price: bestOffer.price,
      priceWithTaxes: bestOffer.price,
      listPrice: bestOffer.listPrice,
      listPriceWithTaxes: bestOffer.listPrice,
      seller: bestOffer.seller,
      itemOffered: {
        sku: activeSku,
        name: product.name,
        // Nenhuma das duas fontes (`PDPVariantProduct`/`PDPProduct`) traz
        // `unitMultiplier` — o `CartItem` aceita `null`.
        unitMultiplier: null,
        gtin: product.gtin,
        image: product.image,
        brand: groupProduct.brand,
        isVariantOf: {
          productGroupID: groupProduct.isVariantOf.productGroupID,
          name: groupProduct.isVariantOf.name,
          skuVariants: skuVariants
            ? {
                activeVariations,
                slugsMap: skuVariants.slugsMap ?? {},
                availableVariations: skuVariants.availableVariations ?? {},
              }
            : null,
        },
        additionalProperty: [
          ...(product.additionalProperty ?? []),
          ...attachmentSelectionToProperties(attachmentSelection),
        ],
      },
    })

    // `cartStore.addItem` não passa pelo `useBuyButton` do core, então não
    // dispara o analytics `add_to_cart` que o `useMinicart` escuta para abrir
    // o drawer — disparamos o evento de abertura explicitamente.
    dispatch(EventName.OpenCartDrawer)
  }, [
    product,
    groupProduct,
    bestOffer,
    hasMissingRequiredAttachment,
    quantity,
    activeSku,
    skuVariants,
    activeVariations,
    attachmentSelection,
  ])

  return {
    quantity,
    setQuantity,
    maxQuantity,
    addToCart,
    disabled: hasMissingRequiredAttachment,
  }
}
