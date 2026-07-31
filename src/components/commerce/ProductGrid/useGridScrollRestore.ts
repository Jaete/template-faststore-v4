import { useEffect, useLayoutEffect, useRef } from 'react'
import { useRouter } from 'next/router'

const STORAGE_PREFIX = '__grid_scroll_'

/** Chave que o `useScrollRestoration` do core usa para restaurar o scroll. */
const CORE_SCROLL_PREFIX = '__fs_scroll_'

/**
 * Desarma a restauração de scroll do core para a entrada de histórico atual,
 * apagando a chave que ele lê. Precisamos da flag `scrollRestoration` LIGADA (é
 * o que impede o core de resetar a paginação ao remontar a PLP na volta da
 * PDP), mas a mesma flag liga o restore de scroll do core, que faz um `scrollTo`
 * tardio (setTimeout 800ms) no `popstate` — e como esse listener é global, ele
 * dispara com a PDP ainda visível, causando o salto que se vê na PDP. Sem a
 * chave, o restore do core vira no-op e a restauração fica só por nossa conta.
 */
function disarmCoreRestore(key: string) {
  try {
    sessionStorage.removeItem(`${CORE_SCROLL_PREFIX}${key}`)
  } catch {
    // sessionStorage indisponível — nada a desarmar.
  }
}

/**
 * Chave da posição de scroll salva. Usamos `history.state.key` — um id único
 * que o Next atribui a CADA entrada do histórico. Assim a restauração só casa
 * quando voltamos (back/forward) para a MESMA entrada de onde saímos (ex.:
 * abrir uma PDP e voltar). Navegar para outra categoria cria uma entrada nova,
 * com key diferente, que nunca bate com a posição salva — então começa do topo.
 */
function getHistoryKey(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.history.state?.key ?? null
}

function readSavedPosition(key: string): number | null {
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`)
    return raw === null ? null : Number(raw)
  } catch {
    return null
  }
}

function savePosition(key: string, y: number) {
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, String(y))
  } catch {
    // sessionStorage indisponível (modo privado/limite) — restauração é um
    // "nice to have", então falhar em silêncio é aceitável.
  }
}

interface UseGridScrollRestoreParams {
  /**
   * `true` quando a grade já tem produtos renderizados. A restauração só pode
   * acontecer depois disso: com a página ainda vazia/curta, o `scrollTo` não
   * alcançaria a posição salva.
   */
  isReady: boolean
}

/**
 * Restaura a posição de scroll da PLP ao voltar para a mesma entrada de
 * histórico (tipicamente: abrir uma PDP e voltar). Substitui o
 * `useScrollRestoration` do core (que roda no `_app` sob a flag
 * `experimental.scrollRestoration`) por uma versão sem o salto visível na
 * página de origem e sem timeout fixo: aqui a restauração acontece num
 * `useLayoutEffect`, já na PLP, assim que os produtos montam.
 */
export function useGridScrollRestore({ isReady }: UseGridScrollRestoreParams) {
  const router = useRouter()

  // Salva a posição continuamente enquanto o usuário rola. Guardar no scroll
  // (em vez de só na saída) cobre qualquer forma de navegação — clique num
  // card, voltar do navegador, fechar aba — sem depender de eventos de rota.
  useEffect(() => {
    const onScroll = () => {
      const key = getHistoryKey()
      if (key) {
        savePosition(key, window.scrollY)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ao SAIR desta PLP (ex.: clique num card → PDP), apaga a chave de scroll do
  // core para a entrada de histórico DESTA PLP. O restore do core roda no
  // `popstate` da volta, mas o listener é global e dispara com a PDP ainda
  // visível — se a chave já não existir, ele vira no-op e o salto some.
  //
  // O timing exige dois eventos:
  // - `routeChangeStart`: a `history.state.key` ainda é a da PLP (a nav pra PDP
  //   não trocou a entrada ainda). Capturamos essa key aqui — é a que o core
  //   grava (`saveScrollPos`) e a que ele tentaria restaurar na volta.
  // - `routeChangeComplete`: apagamos usando a key capturada. Fazer no
  //   `complete` garante que a remoção venha DEPOIS da escrita do core,
  //   independentemente da ordem de registro dos listeners. No `complete` a
  //   `history.state.key` já é a da PDP, por isso não relemos aqui.
  useEffect(() => {
    let keyOnLeave: string | null = null

    const onStart = (url: string) => {
      keyOnLeave = url.endsWith('/p') ? getHistoryKey() : null
    }

    const onComplete = () => {
      if (keyOnLeave) {
        disarmCoreRestore(keyOnLeave)
        keyOnLeave = null
      }
    }

    router.events.on('routeChangeStart', onStart)
    router.events.on('routeChangeComplete', onComplete)
    return () => {
      router.events.off('routeChangeStart', onStart)
      router.events.off('routeChangeComplete', onComplete)
    }
  }, [router])

  // Restaura uma única vez, quando a grade fica pronta. `useLayoutEffect` aplica
  // o scroll antes da pintura, evitando qualquer flash no topo.
  const hasRestored = useRef(false)
  useLayoutEffect(() => {
    if (hasRestored.current || !isReady) {
      return
    }

    const key = getHistoryKey()
    if (!key) {
      return
    }

    hasRestored.current = true

    const savedY = readSavedPosition(key)
    if (savedY === null || savedY <= 0) {
      return
    }

    // Chega perto do destino instantaneamente (sem flash no topo) e anima só o
    // último trecho — dá a sensação de "assentar" suave, sem ver a lista
    // inteira rolando do zero. `prefers-reduced-motion` pula direto pro exato.
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      window.scrollTo(0, savedY)
      return
    }

    const SETTLE_DISTANCE = 200
    const startY = Math.max(0, savedY - SETTLE_DISTANCE)

    window.scrollTo(0, startY)
    // No próximo frame, já pintado em `startY`, anima o resto até a posição
    // exata. Sem o rAF, o browser pode coalescer os dois scrollTo e pular o
    // trecho animado.
    requestAnimationFrame(() => {
      window.scrollTo({ top: savedY, behavior: 'smooth' })
    })
  }, [isReady])
}
