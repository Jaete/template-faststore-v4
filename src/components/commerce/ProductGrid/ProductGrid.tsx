import Filters from '../Filters/Filters'
import ProductGridPage from './ProductGridPage/ProductGridPage'
import ProductGridToolbar from './ProductGridToolbar/ProductGridToolbar'
import SortModal from './SortModal/SortModal'
import FilterDrawer from './FilterDrawer/FilterDrawer'
import LoadMoreSection from './LoadMoreSection/LoadMoreSection'
import { DisplayedCountProvider } from './DisplayedCountContext/DisplayedCountContext'
import { useProductGrid } from './useProductGrid'
import { useGridScrollRestore } from './useGridScrollRestore'
import { useDevice } from '../../../hooks/useDevice'
import { useShiftOnScrollSticky } from '../../../hooks/useShiftOnScrollSticky'
import { resolveAllowedFacets } from './ProductGrid.constants'
import type {
  ProductGridContentProps,
  ProductGridProps,
} from './ProductGrid.types'
import styles from './ProductGrid.module.scss'

// Precisa viver DENTRO do DisplayedCountProvider pra ler o total de produtos
// montados (contador "Exibindo X de Y" e liberação do restore de scroll).
function ProductGridContent({
  emptyStateMessage,
  priceEmptyStateMessage,
  loadMoreLabel,
  allowedFacets,
}: ProductGridContentProps) {
  const {
    pages,
    isEmpty,
    isEmptyByPrice,
    hasNextPage,
    handleLoadMore,
    totalCount,
    totalDisplayed,
    sort,
    handleSortChange,
  } = useProductGrid()
  const { isMobile } = useDevice()
  // Sticky "shift-on-scroll" da coluna de filtros (só desktop — a coluna é
  // `display: none` em tablet/mobile).
  const filtersStickyRef = useShiftOnScrollSticky<HTMLDivElement>({
    enabled: !isMobile,
  })

  // Restaura o scroll ao voltar para esta mesma PLP (ex.: abrir uma PDP e
  // voltar). `isReady` só libera a restauração quando já há produtos montados,
  // pra a página ter altura suficiente para o scroll alcançar a posição salva.
  useGridScrollRestore({ isReady: !isEmpty && totalDisplayed > 0 })

  return (
    <div className={styles.mainContainer}>
      <div className={styles.filtersPlaceholder}>
        <div ref={filtersStickyRef} className={styles.filtersSticky}>
          <Filters allowedFacets={allowedFacets} />
        </div>
      </div>

      <div className={styles.content}>
        {/* `isEmptyByPrice` PRIMEIRO: ele é um refinamento de `isEmpty` (vazio
            COM filtro de preço ativo), então testar `isEmpty` antes deixaria a
            mensagem específica de preço inalcançável. */}
        {isEmptyByPrice ? (
          <p className={styles.empty}>{priceEmptyStateMessage}</p>
        ) : isEmpty ? (
          <p className={styles.empty}>{emptyStateMessage}</p>
        ) : (
          <>
            <ProductGridToolbar
              total={totalCount}
              sort={sort}
              onSortChange={handleSortChange}
            />
            <div className={styles.productGrid}>
              {pages.map((page) => (
                <ProductGridPage
                  key={page}
                  page={page}
                  variant={isMobile ? 'small' : 'default'}
                />
              ))}
            </div>
            <LoadMoreSection
              total={totalCount}
              displayed={totalDisplayed}
              hasNextPage={hasNextPage}
              loadMoreLabel={loadMoreLabel}
              onLoadMore={handleLoadMore}
            />
          </>
        )}
      </div>

      {/* Drawer de filtros (mobile), aberto pelo botão "Filtrar por". Reusa o
          componente Filters (variante drawer) e traz o rodapé Limpar/Aplicar. */}
      <FilterDrawer allowedFacets={allowedFacets} />

      {/* Modal de ordenação (mobile), aberto pelo botão "Ordenar por". A troca
          é aplicada na hora; o botão "Aplicar" do modal só o fecha. */}
      <SortModal sort={sort} onSortChange={handleSortChange} />
    </div>
  )
}

function ProductGrid({
  emptyStateMessage = 'Nenhum produto encontrado para esta categoria.',
  priceEmptyStateMessage = 'Nenhum produto encontrado nessa faixa de preço.',
  loadMoreLabel = 'Carregar mais',
  allowedFacets,
}: ProductGridProps) {
  const resolvedAllowedFacets = resolveAllowedFacets(allowedFacets)

  return (
    <DisplayedCountProvider>
      <ProductGridContent
        emptyStateMessage={emptyStateMessage}
        priceEmptyStateMessage={priceEmptyStateMessage}
        loadMoreLabel={loadMoreLabel}
        allowedFacets={resolvedAllowedFacets}
      />
    </DisplayedCountProvider>
  )
}

export default ProductGrid
