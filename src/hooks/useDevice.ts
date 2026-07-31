import { useEffect, useState } from 'react'

// Casa com `$breakpoint-mobile` em src/styles/config/_breakpoints.scss.
// Manter os dois em sincronia: a detecção em JS (troca de props/markup) e a
// detecção em CSS (media queries) precisam concordar sobre o que é "mobile".
const MOBILE_QUERY = '(max-width: 768px)'

interface Device {
  /** `true` quando a viewport está no range mobile (≤ 768px). */
  isMobile: boolean
}

/**
 * Detecta o dispositivo do usuário a partir da largura da viewport.
 *
 * SSR-safe: no servidor (e no primeiro render do cliente) devolve
 * `isMobile: false`, e só sincroniza com o `matchMedia` real após montar —
 * evita mismatch de hidratação. Componentes que trocam markup por aqui devem
 * tolerar esse primeiro render "desktop".
 */
export function useDevice(): Device {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY)

    const sync = () => setIsMobile(mql.matches)
    sync()

    mql.addEventListener('change', sync)

    return () => mql.removeEventListener('change', sync)
  }, [])

  return { isMobile }
}
