import { usePDP } from 'src/sdk/overrides/PageProvider'

import ActiveSkuProvider from '../../providers/ActiveSkuProvider/ActiveSkuProvider'
import Gallery from './Gallery/Gallery'
import Details from './Details/Details'
import type { ProductInfoProps } from './ProductInfo.types'
import styles from './ProductInfo.module.scss'

/**
 * Section de informações do produto na PDP. Layout em duas colunas:
 * galeria de imagens (esquerda) e informações do produto (direita).
 *
 * A coluna direita traz título, REF, descrição, preço/parcelamento, seletor de
 * SKU, o bloco de compra (quantidade + adicionar ao carrinho) ou "Avise-me"
 * conforme o estoque do SKU ativo, e o simulador de frete.
 *
 * O `ActiveSkuProvider` envolve as duas colunas porque a troca de variante é
 * feita no cliente: `Gallery` e `Details` leem o SKU ativo do contexto em vez de
 * receberem o produto por prop, e é isso que permite trocar tamanho/cor sem
 * navegar nem re-renderizar esta section.
 */
function ProductInfo({ pixDiscountPercent }: ProductInfoProps) {
  const context = usePDP()
  const product = context?.data?.product

  if (!product) {
    return null
  }

  return (
    <ActiveSkuProvider>
      <section className={styles.productInfo}>
        <div className={styles.productInfo__gallery}>
          <Gallery />
        </div>

        <div className={styles.productInfo__details}>
          <Details pixDiscountPercent={pixDiscountPercent} />
        </div>
      </section>
    </ActiveSkuProvider>
  )
}

export default ProductInfo
