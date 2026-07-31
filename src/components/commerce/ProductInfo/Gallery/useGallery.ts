import { useCallback, useMemo, useState } from 'react'

import type { GalleryMedia } from './Gallery.types'

/** Imagem do produto como vem do contexto da PDP (`product.image[]`). */
export interface ProductImage {
  url: string
  alternateName: string
}

interface UseGalleryParams {
  images?: ProductImage[]
}

interface UseGalleryReturn {
  items: GalleryMedia[]
  activeIndex: number
  activeMedia?: GalleryMedia
  setActiveIndex: (index: number) => void
}

/**
 * Normaliza as imagens do produto em `GalleryMedia` e controla o índice ativo
 * da galeria. O tipo (imagem/vídeo) fica indefinido — o `Media` infere pela
 * extensão da URL.
 */
export function useGallery({ images }: UseGalleryParams): UseGalleryReturn {
  const items = useMemo<GalleryMedia[]>(
    () =>
      (images ?? []).map((image) => ({
        src: image.url,
        alt: image.alternateName,
      })),
    [images]
  )

  /**
   * A seleção guarda a QUAL lista de imagens ela pertence, não só o índice.
   *
   * Trocar de SKU troca o array de imagens, e a galeria tem que voltar para a
   * primeira: quem estava na 3ª imagem do SKU anterior veria a 3ª imagem do novo
   * em vez da principal. Amarrando a seleção à lista, uma seleção de outra lista
   * simplesmente deixa de valer e o índice derivado cai para 0 — sem ajuste
   * durante a render (proibido) e sem `useEffect`, que rodaria depois do paint e
   * deixaria um frame com a imagem errada visível.
   */
  const [selection, setSelection] = useState<{
    items: GalleryMedia[]
    index: number
  } | null>(null)

  const activeIndex =
    selection?.items === items && selection.index < items.length
      ? selection.index
      : 0

  const setActiveIndex = useCallback(
    (index: number) => setSelection({ items, index }),
    [items]
  )

  return {
    items,
    activeIndex,
    activeMedia: items[activeIndex],
    setActiveIndex,
  }
}
