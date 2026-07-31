import Button from '../../../ui/Button/Button'
import styles from './LoadMoreSection.module.scss'

interface LoadMoreSectionProps {
  /** Total de produtos do resultado atual (pageInfo.totalCount, já filtrado). */
  total: number
  /** Produtos já paginados/exibidos na tela. */
  displayed: number
  /** Há mais páginas a carregar? Controla a exibição do botão. */
  hasNextPage: boolean
  loadMoreLabel: string
  onLoadMore: () => void
}

// Engloba o botão "carregar mais" e o indicador "Exibindo X de Y produtos".
// Todos os filtros (preço incluído) são facets server-side, então X e Y estão no
// mesmo conjunto: X é o que já foi paginado, Y é o total do resultado filtrado.
function LoadMoreSection({
  total,
  displayed,
  hasNextPage,
  loadMoreLabel,
  onLoadMore,
}: LoadMoreSectionProps) {
  if (total === 0) {
    return null
  }

  const progress = Math.min(100, Math.round((displayed / total) * 100))

  return (
    <div className={styles.loadMore}>
      {hasNextPage && (
        <Button
          label={loadMoreLabel}
          variant="tertiary-stroke"
          onClick={onLoadMore}
        />
      )}

      <div className={styles.status}>
        <div
          className={styles.track}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={displayed}
        >
          <div className={styles.bar} style={{ width: `${progress}%` }} />
        </div>

        <p className={styles.count}>
          Exibindo {displayed} de {total} produtos
        </p>
      </div>
    </div>
  )
}

export default LoadMoreSection
