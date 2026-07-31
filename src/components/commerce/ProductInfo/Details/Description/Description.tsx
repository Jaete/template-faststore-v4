import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import styles from './Description.module.scss'
import {
  hasVisibleHtmlContent,
  sanitizeProductHtml,
} from '../../../../../utils/sanitizeProductHtml'

interface DescriptionProps {
  /** HTML cru vindo da `description` do catálogo VTEX (`<br />`, `<b>` etc.). */
  text?: string
}

/** Altura colapsada (≈ 3 linhas de paragraph-p3: 0.75rem × 1.4 × 3). */
const COLLAPSED_MAX_HEIGHT = '3.15rem'
/** `COLLAPSED_MAX_HEIGHT` em px, para comparar com `scrollHeight`. */
const COLLAPSED_MAX_HEIGHT_PX = 0.75 * 1.4 * 3 * 16
/** Deve casar com a transição de max-height no Description.module.scss. */
const TRANSITION_DURATION = 300

/**
 * Descrição do produto com truncamento suave. Colapsada, limita a ~3 linhas e o
 * "ver mais" fica sobreposto no canto inferior-direito (inline sobre a 3ª
 * linha, mascarando o fim do texto — como no Figma); expandida, cresce até a
 * altura real e o toggle vira "ver menos".
 */
function Description({ text }: DescriptionProps) {
  const textHtml = useMemo(() => sanitizeProductHtml(text), [text])
  const [expanded, setExpanded] = useState(false)
  const [clamped, setClamped] = useState(false)
  // `false` até a medição confirmar que o texto excede 3 linhas — controla se
  // o toggle ("ver mais"/"ver menos") existe, independente do clamp visual.
  const [canToggle, setCanToggle] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState<string>('none')
  const collapseTimeout = useRef<number>()

  useEffect(() => () => window.clearTimeout(collapseTimeout.current), [])

  // `scrollHeight` só reflete o conteúdo real sem o clamp aplicado — por isso
  // a medição roda depois do render (`maxHeight` inicial é `'none'`), e só
  // então decide se o texto cabe em 3 linhas ou precisa do "ver mais".
  useEffect(() => {
    const element = textRef.current

    if (!element) {
      return
    }

    const overflowing = element.scrollHeight > COLLAPSED_MAX_HEIGHT_PX + 1

    setCanToggle(overflowing)
    setClamped(overflowing)
    setMaxHeight(overflowing ? COLLAPSED_MAX_HEIGHT : 'none')
    setExpanded(false)
  }, [textHtml])

  const expand = useCallback(() => {
    window.clearTimeout(collapseTimeout.current)

    const element = textRef.current

    setClamped(false)
    setExpanded(true)
    setMaxHeight(element ? `${element.scrollHeight}px` : 'none')
  }, [])

  const collapse = useCallback(() => {
    setExpanded(false)
    setMaxHeight(COLLAPSED_MAX_HEIGHT)

    collapseTimeout.current = window.setTimeout(
      () => setClamped(true),
      TRANSITION_DURATION
    )
  }, [])

  if (!hasVisibleHtmlContent(textHtml)) {
    return null
  }

  const toggle = expanded ? collapse : expand

  return (
    <div
      ref={textRef}
      className={[
        styles.description,
        clamped ? styles['description--clamped'] : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ maxHeight }}
    >
      {clamped && (
        <>
          <span className={styles.description__floatSpacer} />
          <button
            type="button"
            className={styles.description__toggle}
            onClick={toggle}
          >
            ver mais
          </button>
        </>
      )}

      <span dangerouslySetInnerHTML={{ __html: textHtml }} />

      {canToggle && !clamped && (
        <button
          type="button"
          className={styles.description__toggle}
          onClick={toggle}
        >
          {' '}
          ver menos
        </button>
      )}
    </div>
  )
}

export default Description
