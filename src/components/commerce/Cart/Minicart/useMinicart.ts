import { useCallback } from 'react'
import { useAnalyticsEvent } from '@faststore/sdk'
import { useCart } from 'src/sdk/cart'

import { dispatch, EventName } from '../../../../utils/events'

/**
 * Concentra o estado e as reações do Minicart.
 *
 * Além de expor os itens e o subtotal do carrinho (via `useCart` do core),
 * escuta o evento nativo de analytics `add_to_cart` — disparado pelo
 * `useBuyButton` do FastStore antes de inserir o item no `cartStore` — e
 * traduz para o barramento de eventos da aplicação, abrindo o drawer.
 * Como o Minicart é uma section global (sempre montada), o listener vive aqui.
 */
export function useMinicart() {
  const { items, total, subTotal, isValidating } = useCart()

  useAnalyticsEvent(
    useCallback((event: { name: string }) => {
      if (event.name === 'add_to_cart') {
        dispatch(EventName.OpenCartDrawer)
      }
    }, [])
  )

  return {
    items,
    isEmpty: items.length === 0,
    // Soma dos preços de lista dos itens (sem descontos, sem frete)
    subtotal: subTotal,
    // Soma dos descontos aplicados aos itens
    discount: subTotal - total,
    // Soma dos preços de venda dos itens (com descontos, sem frete)
    total,
    // true enquanto o orderForm revalida (add/remove/troca de item)
    isValidating,
  }
}
