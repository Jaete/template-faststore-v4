import type { SearchCategory } from '../../Search/CategoryCarousel/CategoryCarousel.types'
import type { EmptyCartProps } from '../EmptyCart/EmptyCart.types'
import type { FreeShippingBarTexts } from '../FreeShippingBar/FreeShippingBar.types'
import type { MinicartFooterTexts } from '../MinicartFooter/MinicartFooter.types'

export interface MinicartProps {
  /** Textos do estado vazio (título, subtítulo e botão), configuráveis via CMS */
  emptyCart?: EmptyCartProps
  /** Categorias do carrossel exibido no footer do minicart vazio */
  categories?: SearchCategory[]
  /** Barra de progresso do frete grátis (apenas visual), configurável via CMS */
  freeShipping?: FreeShippingBarTexts & {
    /** Desabilitada, a barra sequer é renderizada */
    enabled?: boolean
    /** Valor mínimo para frete grátis — deve espelhar a promoção da VTEX */
    threshold?: number
  }
  /** Textos do footer do estado com produtos, configuráveis via CMS */
  footer?: MinicartFooterTexts
}
