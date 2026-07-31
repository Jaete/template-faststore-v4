import styles from './Counter.module.scss'

interface CounterProps {
  /** Índice ativo (0-based). */
  activeIndex: number
  /** Total de itens. */
  total: number
}

/** Contador "01/09" da galeria — posições com zero à esquerda. */
function Counter({ activeIndex, total }: CounterProps) {
  if (total <= 0) {
    return null
  }

  const pad = (value: number) => String(value).padStart(2, '0')

  return (
    <p className={styles.counter}>
      {pad(activeIndex + 1)}/{pad(total)}
    </p>
  )
}

export default Counter
