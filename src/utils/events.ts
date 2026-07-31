/**
 * Barramento de eventos da aplicação sobre `CustomEvent` no `window`.
 *
 * Desacopla quem dispara (ex.: o Header) de quem reage (ex.: os drawers):
 * o emissor só conhece o nome do evento, nunca o componente que escuta.
 */

/**
 * Nomes dos eventos customizados da aplicação. O valor de cada membro é a
 * string que trafega no `window`; o membro (`EventName.OpenSearchDrawer`) é o
 * identificador usado no código — nunca se escreve a string crua.
 */
export enum EventName {
  OpenSearchDrawer = 'search-drawer:open',
  OpenCartDrawer = 'cart-drawer:open',
  CloseCartDrawer = 'cart-drawer:close',
  OpenMobileMenu = 'mobile-menu:open',
  CloseMobileMenu = 'mobile-menu:close',
  OpenFilterDrawer = 'filter-drawer:open',
  CloseFilterDrawer = 'filter-drawer:close',
  OpenSortModal = 'sort-modal:open',
  CloseSortModal = 'sort-modal:close',
  OpenInstallmentsModal = 'installments-modal:open',
  CloseInstallmentsModal = 'installments-modal:close',
  OpenShareModal = 'share-modal:open',
  CloseShareModal = 'share-modal:close',
}

/**
 * Mapa de eventos conhecidos → tipo do `detail` que cada um carrega.
 * `void` = evento sem payload. Adicione uma entrada aqui (chaveada pelo membro
 * do `EventName`) para catalogar um novo evento e ganhar checagem de nome e de
 * payload em tempo de compilação.
 */
export interface AppEventMap {
  [EventName.OpenSearchDrawer]: void
  [EventName.OpenCartDrawer]: void
  [EventName.CloseCartDrawer]: void
  [EventName.OpenMobileMenu]: void
  [EventName.CloseMobileMenu]: void
  [EventName.OpenFilterDrawer]: void
  [EventName.CloseFilterDrawer]: void
  [EventName.OpenSortModal]: void
  [EventName.CloseSortModal]: void
  [EventName.OpenInstallmentsModal]: void
  [EventName.CloseInstallmentsModal]: void
  [EventName.OpenShareModal]: void
  [EventName.CloseShareModal]: void
}

export type AppEventName = keyof AppEventMap

/**
 * Assina um evento **nativo do DOM** em qualquer alvo e devolve a função de
 * cancelamento — pronta para ser retornada direto de um `useEffect`. Substitui
 * o par manual `addEventListener`/`removeEventListener`.
 *
 * O `type` é autocompletado e o `event` do handler vem tipado conforme o alvo
 * (`document` → `DocumentEventMap`, `window` → `WindowEventMap`, etc.).
 */
export function on<K extends keyof DocumentEventMap>(
  target: Document,
  type: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): () => void
export function on<K extends keyof WindowEventMap>(
  target: Window,
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): () => void
export function on<K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  type: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): () => void
export function on(
  target: EventTarget,
  type: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): () => void {
  target.addEventListener(type, handler, options)

  return () => target.removeEventListener(type, handler, options)
}

// Assinaturas sobrecarregadas: eventos sem payload dispensam o 2º argumento;
// eventos com payload passam a exigi-lo.
export function dispatch<E extends AppEventName>(
  ...args: AppEventMap[E] extends void
    ? [event: E]
    : [event: E, detail: AppEventMap[E]]
): void
export function dispatch(eventName: string, detail?: unknown): void {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(eventName, { detail }))
}

/**
 * Assina um evento e devolve a função de cancelamento — pronta para ser
 * retornada direto de um `useEffect`.
 *
 * Nomes catalogados em `AppEventMap` recebem o `detail` tipado; nomes vindos
 * como `string` genérica (ex.: o `openEventName` do Drawer base, definido pelo
 * CMS) caem em `unknown`.
 */
export function listen<E extends AppEventName>(
  eventName: E,
  handler: (detail: AppEventMap[E]) => void
): () => void
export function listen(
  eventName: string,
  handler: (detail: unknown) => void
): () => void
export function listen(
  eventName: string,
  handler: (detail: unknown) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }

  return on(window, eventName as keyof WindowEventMap, (event) =>
    handler((event as CustomEvent).detail)
  )
}
