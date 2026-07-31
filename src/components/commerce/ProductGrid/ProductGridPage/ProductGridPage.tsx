import { useSearch } from '@faststore/sdk'
import { useGalleryPage } from 'src/sdk/product/usePageProductsQuery'
import { useEffect } from 'react'

import ProductCard from '../../ProductCard/ProductCard'
import type { ProductCardVariant } from '../../ProductCard/ProductCard.types'
import { useDisplayedCount } from '../DisplayedCountContext/DisplayedCountContext'
import { mapProductToCard } from '../../../../utils/mapProductToCard'
import { useColorPalette } from '../../../providers/ColorPalette/useColorPalette'

interface ProductGridPageProps {
  page: number
  /** Variante dos cards — `small` no mobile (ver ProductGrid). */
  variant?: ProductCardVariant
}

// Teto do índice usado no delay escalonado da animação de entrada do card.
// Com ~55ms por índice, cobre ~2 linhas da grid antes de o delay parar de
// crescer — o resto da leva entra junto no delay máximo, sem cauda longa.
const MAX_ANIMATION_INDEX = 11

// Cada página precisa do próprio componente porque `useGalleryPage` é um hook:
// só assim cada índice de página busca/cacheia seus produtos de forma isolada
// (mesmo padrão do ProductGalleryPage original do core).
function ProductGridPage({ page, variant = 'default' }: ProductGridPageProps) {
  const { itemsPerPage } = useSearch()
  const { data } = useGalleryPage(page)
  const { reportPageDisplayed, clearPage } = useDisplayedCount()
  const palette = useColorPalette()

  const edges = data?.search?.products?.edges ?? []

  // Todos os filtros (preço incluído) são facets server-side, então os edges já
  // chegam filtrados — nada a cortar aqui.
  const cards = edges.map(({ node }) => mapProductToCard(node, palette))

  // Contador "Exibindo X de Y": conta os produtos que a VTEX paginou. Só conta
  // quando a página já resolveu (data !== null); enquanto carrega, 0.
  const displayed = data === null ? 0 : edges.length
  useEffect(() => {
    reportPageDisplayed(page, displayed)
  }, [reportPageDisplayed, page, displayed])

  // No unmount (ex.: filtro aplicado reseta a paginação e desmonta as páginas
  // antigas), remove esta página do total para não deixar a contagem presa.
  useEffect(() => {
    return () => clearPage(page)
  }, [clearPage, page])

  // `data === null` = página ainda não resolvida (primeiro carregamento ou
  // "carregar mais" recém-clicado): mostra skeletons já com o número de itens
  // esperado, pra não deixar a grid saltar de altura quando os produtos chegam.
  if (data === null) {
    return (
      <>
        {Array.from({ length: itemsPerPage }, (_, index) => (
          <ProductCard key={index} isLoading variant={variant} />
        ))}
      </>
    )
  }

  return (
    <>
      {cards.map((card, index) => (
        <ProductCard
          key={card.href}
          product={card}
          variant={variant}
          // Escalona a animação de entrada apenas dentro da própria página: cada
          // página remonta ao mudar filtro (anima a leva inteira) e, no "carregar
          // mais", só a nova página monta/anima — reiniciar o índice por página
          // evita que a 3ª/4ª leva herde um delay acumulado gigante.
          animationIndex={Math.min(index, MAX_ANIMATION_INDEX)}
        />
      ))}
    </>
  )
}

export default ProductGridPage
