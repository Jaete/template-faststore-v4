import Modal from '../../../ui/Modal/Modal'
import Button from '../../../ui/Button/Button'
import Checkbox from '../../../ui/Checkbox/Checkbox'
import { SortIcon } from '../../../ui/Icons'
import { dispatch, EventName } from '../../../../utils/events'
import { SORT_OPTIONS } from '../ProductGridToolbar/ProductGridToolbar'
import type { SearchSort } from '../ProductGridToolbar/ProductGridToolbar.types'
import styles from './SortModal.module.scss'

interface SortModalProps {
  sort: SearchSort
  onSortChange: (sort: SearchSort) => void
}

// Modal de ordenação exibido apenas no mobile (aberto pelo botão "Ordenar por"
// do toolbar via EventName.OpenSortModal). Reaproveita SORT_OPTIONS do toolbar.
//
// Visual de checkbox (conforme Figma), mas comportamento de radio: a ordenação
// é sempre um valor único, então marcar uma opção desmarca a anterior. A troca
// é aplicada na hora (reordena a lista atrás do modal); o botão "Aplicar" só
// fecha o modal.
function SortModal({ sort, onSortChange }: SortModalProps) {
  return (
    <Modal
      openEventName={EventName.OpenSortModal}
      closeEventName={EventName.CloseSortModal}
      title="Ordenar por"
      titleIcon={<SortIcon />}
      closeAriaLabel="Fechar ordenação"
      footer={
        <div className={styles.sortModal__footer}>
          <Button
            label="Aplicar"
            variant="secondary"
            onClick={() => dispatch(EventName.CloseSortModal)}
          />
        </div>
      }
    >
      <ul
        className={styles.sortModal}
        role="radiogroup"
        aria-label="Ordenar por"
      >
        {SORT_OPTIONS.map((option) => {
          const selected = option.value === sort

          return (
            <li key={option.value} className={styles.sortModal__row}>
              <Checkbox
                label={option.label}
                checked={selected}
                // Radio-like: só reage ao marcar uma opção não selecionada;
                // desmarcar não faz nada (sempre há uma ordenação ativa).
                onChange={() => {
                  if (!selected) {
                    onSortChange(option.value as SearchSort)
                  }
                }}
              />
            </li>
          )
        })}
      </ul>
    </Modal>
  )
}

export default SortModal
