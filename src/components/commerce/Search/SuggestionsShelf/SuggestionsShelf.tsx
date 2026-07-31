import Shelf from '../../Shelf/Shelf'
import type { SuggestionsShelfProps } from './SuggestionsShelf.types'

interface Props extends SuggestionsShelfProps {
  /** Termo digitado pelo usuário na busca — usado quando `searchByTerm` está ativo. */
  term: string
}

function SuggestionsShelf({
  searchByTerm = false,
  term,
  collectionId,
  categoryId,
  ...props
}: Props) {
  return (
    <Shelf
      {...props}
      term={searchByTerm ? term : undefined}
      collectionId={searchByTerm ? undefined : collectionId}
      categoryId={searchByTerm ? undefined : categoryId}
      variant="small"
      showArrows={false}
    />
  )
}

export default SuggestionsShelf
