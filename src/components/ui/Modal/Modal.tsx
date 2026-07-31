import { createPortal } from 'react-dom'

import IconButton from '../IconButton/IconButton'
import { CloseIcon } from '../Icons'
import type { ModalProps } from './Modal.types'
import { useModal } from './useModal'
import styles from './Modal.module.scss'

function Modal({
  openEventName,
  closeEventName,
  title,
  titleIcon,
  children,
  footer,
  closeAriaLabel = 'Fechar',
  onClose,
}: ModalProps) {
  const { isOpen, isClosing, close } = useModal({
    openEventName,
    closeEventName,
    onClose,
  })

  // Diferente do Drawer (que fica sempre no DOM), o modal monta/desmonta — não
  // tem conteúdo relevante para SEO e assim não paga overlay oculto. `isOpen`/
  // `isClosing` só ficam true após um evento no cliente (ver useModal), então no
  // SSR e no primeiro render do cliente isto retorna null e `document` nunca é
  // tocado — dispensa a flag de "mounted".
  if (!isOpen && !isClosing) {
    return null
  }

  return createPortal(
    <div
      className={[styles.modal, isClosing ? styles['modal--closing'] : '']
        .filter(Boolean)
        .join(' ')}
      onClick={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        className={[
          styles.modal__card,
          isClosing ? styles['modal__card--closing'] : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.modal__header}>
          <div className={styles.modal__title}>
            {titleIcon && (
              <span className={styles.modal__titleIcon}>{titleIcon}</span>
            )}
            {title}
          </div>

          <IconButton ariaLabel={closeAriaLabel} onClick={close}>
            <CloseIcon className={styles.modal__closeIcon} />
          </IconButton>
        </header>

        <div
          className={[
            styles.modal__body,
            footer ? styles['modal__body--withFooter'] : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>

        {footer && <div className={styles.modal__footer}>{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

export default Modal
