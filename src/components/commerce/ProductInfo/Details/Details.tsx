import { usePDP } from 'src/sdk/overrides/PageProvider'

import type { PDPVariantProduct } from '../../../../types/faststore-custom'

import { useActiveSku } from '../../../providers/ActiveSkuProvider/ActiveSkuProvider'
import Header from './Header/Header'
import Description from './Description/Description'
import Price from './Price/Price'
import SkuSelector from './SkuSelector/SkuSelector'
import { useSkuSelector } from './SkuSelector/useSkuSelector'
import AttachmentSelector from './AttachmentSelector/AttachmentSelector'
import { useProductDetails } from './useProductDetails'
import BuyBlock from './BuyBlock/BuyBlock'
import ProductUnavailable from './ProductUnavailable/ProductUnavailable'
import ShippingSimulator from './ShippingSimulator/ShippingSimulator'
import styles from './Details.module.scss'

interface DetailsProps {
  /** Percentual de desconto no PIX vindo do CMS (ex.: 2 = 2%). */
  pixDiscountPercent?: number
}

/**
 * Coluna de informações do produto na PDP: título + REF + ações, divisórias,
 * descrição, bloco de preço/parcelamento, seletor de SKU, seletor de anexos e
 * o switch entre comprar (`BuyBlock`) e "Avise-me" (`ProductUnavailable`).
 *
 * Os dados vêm do SKU ativo (contexto), então trocar de variante atualiza nome,
 * REF, preço, parcelamento e disponibilidade sem navegar. A descrição e as
 * dimensões disponíveis continuam vindo do `usePDP`: a API resolve
 * `description` a partir do `isVariantOf`, ou seja é a mesma para todos os
 * SKUs do grupo, e `availableVariations` também descreve o grupo, não o SKU.
 */
function Details({ pixDiscountPercent }: DetailsProps) {
  const {
    product,
    activeVariations,
    isAvailable,
    selectVariation,
    isVariantsPending,
    attachmentSelection,
    setAttachmentValue,
  } = useActiveSku()
  const groupProduct = usePDP()?.data?.product

  const {
    name,
    referenceCode,
    formattedListPrice,
    formattedSellingPrice,
    hasDiscount,
    discountLabel,
    pixPrice,
    installment,
    installmentRows,
  } = useProductDetails({ product, pixDiscountPercent })

  const skuDimensions = useSkuSelector({
    skuVariants: groupProduct?.isVariantOf?.skuVariants,
    // Ver `ActiveSkuProvider`: o codegen tipa `allVariantProducts` pelo fragment
    // base do core, mas o `ClientProduct` pede a seleção completa.
    variants: groupProduct?.isVariantOf?.skuVariants
      ?.allVariantProducts as unknown as PDPVariantProduct[] | null | undefined,
    activeVariations,
    isVariantsPending,
  })

  const skuAttachments = product?.skuAttachments ?? []

  return (
    <div className={styles.details}>
      <Header name={name} referenceCode={referenceCode} />

      <hr className={styles.details__divider} />

      <Description text={groupProduct?.description ?? ''} />

      <hr className={styles.details__divider} />

      <Price
        formattedListPrice={formattedListPrice}
        formattedSellingPrice={formattedSellingPrice}
        hasDiscount={hasDiscount}
        discountLabel={discountLabel}
        pixPrice={pixPrice}
        installment={installment}
        installmentRows={installmentRows}
      />

      <hr className={styles.details__divider} />

      {(skuDimensions.length > 0 || skuAttachments.length > 0) && (
        <>
          <SkuSelector dimensions={skuDimensions} onSelect={selectVariation} />

          <AttachmentSelector
            attachments={skuAttachments}
            selection={attachmentSelection}
            onSelect={setAttachmentValue}
          />

          <hr className={styles.details__divider} />
        </>
      )}

      {isAvailable ? <BuyBlock /> : <ProductUnavailable />}

      {product?.sku && isAvailable && (
        <ShippingSimulator
          sku={product.sku}
          sellerId={product.offers?.offers?.[0]?.seller?.identifier}
        />
      )}
    </div>
  )
}

export default Details
