import { usePDP } from 'src/sdk/overrides/PageProvider'

import Accordion from '../../ui/Accordion/Accordion'
import {
  hasVisibleHtmlContent,
  sanitizeProductHtml,
} from '../../../utils/sanitizeProductHtml'
import SpecificationGroupTable from './SpecificationGroupTable/SpecificationGroupTable'
import { tableSpecificationGroups } from './SpecificationGroupTable/specificationGroups'
import Measurements from './Measurements/Measurements'
import type { ProductAccordionProps } from './ProductAccordion.types'
import styles from './ProductAccordion.module.scss'

/**
 * Section de abas (Accordion) da PDP. Fica separada de `ProductInfo` para
 * poder ser reordenada independentemente entre as sections da PDP no CMS.
 *
 * A primeira aba é a descrição do produto (`isVariantOf.description`, a mesma
 * para todos os SKUs do grupo). Depois, uma aba por specificationGroup do
 * catálogo, na ordem em que a API retorna — nenhum grupo é tratado de forma
 * especial por nome, então a PDP acompanha o cadastro sem mudança de código.
 *
 * As medidas físicas (`skuDimensions`) variam por SKU e dependem de um resolver
 * que exige credenciais de aplicação, por isso ficam atrás de `showMeasurements`
 * — ver `src/graphql/vtex/resolvers/skuDimensions.ts`.
 */
function ProductAccordion({
  descriptionTitle = 'Descrição',
  showMeasurements = false,
  measurementsTitle = 'Medidas',
}: ProductAccordionProps) {
  const product = usePDP()?.data?.product
  const descriptionHtml = sanitizeProductHtml(product?.description)
  const hasDescription = hasVisibleHtmlContent(descriptionHtml)
  const groups = tableSpecificationGroups(product?.specificationGroups)
  const skuDimensions = product?.skuDimensions
  const hasMeasurements =
    showMeasurements &&
    (Boolean(skuDimensions?.withPackage) ||
      Boolean(skuDimensions?.withoutPackage))

  if (!hasDescription && groups.length === 0 && !hasMeasurements) {
    return null
  }

  return (
    <section className={styles.productAccordion}>
      {hasDescription && (
        <Accordion title={descriptionTitle} icon="plusMinus" defaultOpen>
          <span dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
        </Accordion>
      )}

      {groups.map((group) => (
        <Accordion
          key={group.originalName || group.name}
          title={group.name}
          icon="plusMinus"
          contentPadding={32}
        >
          <SpecificationGroupTable specifications={group.specifications} />
        </Accordion>
      ))}

      {hasMeasurements && (
        <Accordion
          title={measurementsTitle}
          icon="plusMinus"
          contentPadding={32}
        >
          <Measurements dimensions={skuDimensions} />
        </Accordion>
      )}
    </section>
  )
}

export default ProductAccordion
