import { useEffect, useRef } from 'react'

interface UseShiftOnScrollStickyParams {
  /**
   * Distância do topo da viewport respeitada quando o topo do elemento está
   * visível — normalmente a altura do header sticky + um respiro.
   */
  topGap?: number
  /** Desliga o efeito (ex.: no mobile, onde a coluna nem aparece). */
  enabled?: boolean
}

// Sticky "shift-on-scroll": ajusta dinamicamente o `top` de um elemento
// `position: sticky` conforme a direção do scroll, para dar o efeito de "grudar
// pelas duas pontas" mesmo quando o conteúdo é mais alto que a viewport.
//
// - Conteúdo mais CURTO que a viewport: `top` fica em `topGap` — gruda no topo
//   e acompanha o scroll o tempo todo (comportamento sticky clássico).
// - Conteúdo mais ALTO que a viewport: ao descer, o `top` vai ficando negativo
//   até a base do elemento encostar na base da tela (aí a base fica visível/
//   presa); ao subir, o `top` volta a crescer, revelando o topo. Sem scroll
//   interno e sem cortar conteúdo.
//
// CSS puro não distingue esses dois cenários numa regra só — por isso o JS.
export function useShiftOnScrollSticky<T extends HTMLElement>({
  topGap = 104,
  enabled = true,
}: UseShiftOnScrollStickyParams = {}) {
  const ref = useRef<T>(null)
  // `top` atual aplicado ao elemento e a última posição de scroll conhecida.
  // Em refs (não estado): mudam a cada frame de scroll e não devem re-renderizar.
  const currentTop = useRef(topGap)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) {
      return
    }

    lastScrollY.current = window.scrollY
    currentTop.current = topGap
    el.style.position = 'sticky'
    el.style.top = `${topGap}px`

    const update = () => {
      const elHeight = el.offsetHeight
      const viewportH = window.innerHeight

      // Limite inferior do `top`: quando o elemento é mais alto que a viewport,
      // é o valor (negativo) que encosta a base do elemento na base da tela.
      // Quando cabe, o piso é o próprio `topGap` (não faz sentido ir além).
      const minTop = Math.min(topGap, viewportH - elHeight)

      const scrollY = window.scrollY
      const delta = scrollY - lastScrollY.current
      lastScrollY.current = scrollY

      // Rolar pra baixo (delta > 0) empurra o `top` pra baixo (mais negativo);
      // pra cima puxa de volta. Sempre clampado entre [minTop, topGap].
      const next = Math.min(
        topGap,
        Math.max(minTop, currentTop.current - delta)
      )

      if (next !== currentTop.current) {
        currentTop.current = next
        el.style.top = `${next}px`
      }
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [topGap, enabled])

  return ref
}
