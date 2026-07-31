import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'

interface DisplayedCountContextValue {
  /**
   * Cada página reporta quantos produtos a VTEX devolveu (o tamanho dos edges).
   * Alimenta o contador "Exibindo X de Y" e a barra de progresso.
   */
  reportPageDisplayed: (page: number, displayed: number) => void
  /** Total de produtos paginados somando todas as páginas montadas. */
  totalDisplayed: number
  /**
   * Remove uma página do mapa de contagem. Chamado no unmount da página — ao
   * filtrar/reordenar, a busca desmonta as páginas antigas e sem isto seus
   * valores ficariam "presos" no total.
   */
  clearPage: (page: number) => void
}

const DisplayedCountContext = createContext<DisplayedCountContextValue | null>(
  null
)

/**
 * Contagem de produtos efetivamente montados na grid.
 *
 * Não dá pra derivar de `pages.length * itemsPerPage`: a última página é parcial
 * e, enquanto uma página não resolve (`data === null`), ela renderiza skeletons e
 * ainda não contribui com produto nenhum. Por isso cada página reporta o próprio
 * número, e o total é a soma.
 *
 * Dois consumidores: o "Exibindo X de Y" do LoadMoreSection e o
 * `useGridScrollRestore`, que só libera a restauração de scroll quando já há
 * produtos montados (a página precisa de altura pra alcançar a posição salva).
 *
 * Nota histórica: este provider já carregou o estado do filtro de preço, quando
 * ele era client-side. Não é mais — preço é facet server-side (a seleção vive nos
 * `selectedFacets`/URL), então tanto os produtos quanto o `totalCount` já chegam
 * filtrados da API.
 */
export function DisplayedCountProvider({ children }: PropsWithChildren) {
  const [displayedByPage, setDisplayedByPage] = useState<
    Record<number, number>
  >({})

  const reportPageDisplayed = useCallback((page: number, displayed: number) => {
    setDisplayedByPage((prev) =>
      prev[page] === displayed ? prev : { ...prev, [page]: displayed }
    )
  }, [])

  // Ao filtrar/reordenar, a busca reseta a paginação e as páginas antigas
  // desmontam. Sem remover suas entradas aqui, o total continuaria somando
  // páginas que já não existem (ex.: "Exibindo 29 de 5").
  const clearPage = useCallback((page: number) => {
    setDisplayedByPage((prev) => {
      if (!(page in prev)) {
        return prev
      }
      const next = { ...prev }
      delete next[page]
      return next
    })
  }, [])

  const totalDisplayed = useMemo(
    () => Object.values(displayedByPage).reduce((sum, count) => sum + count, 0),
    [displayedByPage]
  )

  const value = useMemo(
    () => ({ reportPageDisplayed, totalDisplayed, clearPage }),
    [reportPageDisplayed, totalDisplayed, clearPage]
  )

  return (
    <DisplayedCountContext.Provider value={value}>
      {children}
    </DisplayedCountContext.Provider>
  )
}

export function useDisplayedCount() {
  const context = useContext(DisplayedCountContext)

  if (!context) {
    throw new Error(
      'useDisplayedCount precisa estar dentro de <DisplayedCountProvider>'
    )
  }

  return context
}
