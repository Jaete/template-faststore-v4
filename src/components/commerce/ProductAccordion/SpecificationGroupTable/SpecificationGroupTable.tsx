import {
  hasVisibleHtmlContent,
  sanitizeProductHtml,
} from '../../../../utils/sanitizeProductHtml'
import type { SpecificationGroup } from './specificationGroups'
import styles from './SpecificationGroupTable.module.scss'

interface SpecificationGroupTableProps {
  specifications: SpecificationGroup['specifications']
}

/**
 * Tabela nome/valor das especificações de UM grupo do catálogo. Os valores
 * podem vir com HTML do cadastro, então passam pelo sanitizador antes do
 * `dangerouslySetInnerHTML`.
 */
function SpecificationGroupTable({
  specifications,
}: SpecificationGroupTableProps) {
  if (specifications.length === 0) {
    return null
  }

  // No desktop as specs se dividem em 2 tabelas lado a lado; no mobile o CSS
  // empilha tudo numa coluna só, então a segunda metade simplesmente continua
  // depois da primeira — não precisa de detecção de device em JS.
  const half = Math.ceil(specifications.length / 2)
  const columns = [
    specifications.slice(0, half),
    specifications.slice(half),
  ].filter((column) => column.length > 0)

  return (
    <div className={styles.specificationGroupTable}>
      <div className={styles.specificationGroupTable__columns}>
        {columns.map((column, columnIndex) => (
          <table
            key={columnIndex}
            className={styles.specificationGroupTable__table}
          >
            <tbody>
              {column.map((specification) => {
                const valueHtml = sanitizeProductHtml(
                  specification.values.join(', ')
                )

                if (!hasVisibleHtmlContent(valueHtml)) {
                  return null
                }

                return (
                  <tr key={specification.name}>
                    <th
                      className={styles.specificationGroupTable__label}
                      scope="row"
                    >
                      {specification.name}
                    </th>
                    <td
                      className={styles.specificationGroupTable__value}
                      dangerouslySetInnerHTML={{ __html: valueHtml }}
                    />
                  </tr>
                )
              })}
            </tbody>
          </table>
        ))}
      </div>
    </div>
  )
}

export default SpecificationGroupTable
