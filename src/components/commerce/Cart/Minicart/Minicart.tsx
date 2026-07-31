import { useUI } from '@faststore/ui'

import Drawer from '../../../ui/Drawer/Drawer'
import { EventName } from '../../../../utils/events'
import CategoryCarousel from '../../Search/CategoryCarousel/CategoryCarousel'
import EmptyCart from '../EmptyCart/EmptyCart'
import MinicartItem from '../MinicartItem/MinicartItem'
import MinicartFooter from '../MinicartFooter/MinicartFooter'
import FreeShippingBar from '../FreeShippingBar/FreeShippingBar'
import { useMinicart } from './useMinicart'
import styles from './Minicart.module.scss'
import type { MinicartProps } from './Minicart.types'

function Minicart({
  emptyCart,
  categories,
  freeShipping,
  footer,
}: MinicartProps) {
  const { items, isEmpty, subtotal, discount, total, isValidating } =
    useMinicart()

  const showFreeShipping =
    freeShipping?.enabled !== false &&
    typeof freeShipping?.threshold === 'number' &&
    freeShipping.threshold > 0

  // O useBuyButton do core chama openCart() em todo add-to-cart, e o
  // UIProvider adiciona a classe `no-scroll` no <body>. Sem o CartSidebar
  // nativo montado, ninguém chama closeCart() — sincronizamos aqui no
  // fechamento do drawer, senão o scroll da página fica travado.
  const { closeCart } = useUI()

  return (
    <Drawer
      openEventName={EventName.OpenCartDrawer}
      closeEventName={EventName.CloseCartDrawer}
      title={
        <div className={styles.minicart__title}>
          <span>Carrinho</span>
          {items.length > 0 && (
            <span className={styles.minicart__badge}>{items.length}</span>
          )}
        </div>
      }
      closeAriaLabel="Fechar carrinho"
      onClose={closeCart}
      footer={
        !isEmpty && (
          <>
            {showFreeShipping && (
              <div className={styles.minicart__freeShipping}>
                <FreeShippingBar
                  threshold={freeShipping.threshold as number}
                  currentValue={total}
                  pendingMessage={freeShipping.pendingMessage}
                  achievedMessage={freeShipping.achievedMessage}
                />
              </div>
            )}
            <MinicartFooter
              subtotal={subtotal}
              discount={discount}
              total={total}
              isValidating={isValidating}
              {...footer}
            />
          </>
        )
      }
    >
      {isEmpty ? (
        <div className={styles.minicart}>
          <div className={styles.minicart__emptyContent}>
            <EmptyCart {...emptyCart} />
          </div>

          {categories && categories.length > 0 && (
            <div className={styles.minicart__categories}>
              <CategoryCarousel categories={categories} />
            </div>
          )}
        </div>
      ) : (
        <ul className={styles.minicart__items}>
          {items.map((item) => (
            <li key={item.id} className={styles.minicart__item}>
              <MinicartItem item={item} disabled={isValidating} />
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  )
}

export default Minicart
