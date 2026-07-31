import { useCallback, useSyncExternalStore } from 'react'
import { useCart } from 'src/sdk/cart'

import { dispatch, EventName } from '../../../utils/events'

/**
 * Concentra o estado e os disparadores de eventos do Header.
 *
 * `isScrolled` indica se a página saiu do topo — usado pelo header sobreposto
 * ao banner para virar sólido ao scrollar. Implementado com
 * useSyncExternalStore: o scroll é estado externo ao React, o snapshot
 * inicial é lido direto no render (sem setState em effect) e no SSR o
 * snapshot do servidor garante `false`. Com `overlayBanner: false` (header já
 * sempre sólido) não registra listener e retorna sempre `false`.
 *
 * O Header não conhece os drawers/overlays que reagem às ações — apenas
 * emite `CustomEvent`s no `window`. Quem escuta (ex.: o Search Drawer, via
 * `useDrawer`) decide o que fazer. Esse desacoplamento evita que o Header
 * precise renderizar ou receber refs desses componentes.
 */
export function useHeader(overlayBanner: boolean) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!overlayBanner) {
        return () => {}
      }

      window.addEventListener('scroll', onStoreChange, { passive: true })

      return () => window.removeEventListener('scroll', onStoreChange)
    },
    [overlayBanner]
  )

  const isScrolled = useSyncExternalStore(
    subscribe,
    () => overlayBanner && window.scrollY > 0,
    () => false
  )

  const openSearch = useCallback(() => dispatch(EventName.OpenSearchDrawer), [])
  const openCart = useCallback(() => dispatch(EventName.OpenCartDrawer), [])
  const openMobileMenu = useCallback(
    () => dispatch(EventName.OpenMobileMenu),
    []
  )

  const { items } = useCart()

  return {
    isScrolled,
    openSearch,
    openCart,
    openMobileMenu,
    cartItemsCount: items.length,
  }
}
