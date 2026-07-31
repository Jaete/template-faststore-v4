import Modal from '../../../../ui/Modal/Modal'
import { EventName } from '../../../../../utils/events'
import type { InstallmentsModalProps } from './InstallmentsModal.types'
import styles from './InstallmentsModal.module.scss'

/**
 * Modal que lista todas as opções de parcelamento do produto. Usa o `ui/Modal`
 * genérico; aqui fica só o conteúdo (a lista de parcelas). A abertura vem do
 * botão "ver parcelas" (Price) via EventName.OpenInstallmentsModal.
 */
function InstallmentsModal({ rows }: InstallmentsModalProps) {
  return (
    <Modal
      openEventName={EventName.OpenInstallmentsModal}
      closeEventName={EventName.CloseInstallmentsModal}
      title="Parcelamento"
      closeAriaLabel="Fechar opções de parcelamento"
    >
      <ul className={styles.installmentsModal__list}>
        {rows.map((row) => (
          <li key={row.number} className={styles.installmentsModal__row}>
            <span className={styles.installmentsModal__rowLabel}>
              {row.number}x de {row.formattedValue}
            </span>
            <span className={styles.installmentsModal__rowTag}>
              {row.interestFree ? 'sem juros' : 'com juros'}
            </span>
          </li>
        ))}
      </ul>
    </Modal>
  )
}

export default InstallmentsModal
