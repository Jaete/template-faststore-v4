import IconButton from '../IconButton/IconButton'
import { CloseIcon } from '../Icons'
import type { DrawerProps } from './Drawer.types'
import { useDrawer } from './useDrawer'
import styles from './Drawer.module.scss'

function Drawer({
  openEventName,
  closeEventName,
  title,
  children,
  footer,
  closeAriaLabel = 'Fechar',
  onClose,
}: DrawerProps) {
  const { isOpen, isClosing, close } = useDrawer({
    openEventName,
    closeEventName,
    onClose,
  })

  return (
    <div className={styles.drawer}>
      <div
        className={[
          styles.drawer__overlay,
          isOpen ? styles['drawer__overlay--open'] : '',
          isClosing ? styles['drawer__overlay--closing'] : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={close}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        className={[
          styles.drawer__panel,
          isOpen ? styles['drawer__panel--open'] : '',
          isClosing ? styles['drawer__panel--closing'] : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <header className={styles.drawer__header}>
          <div className={styles.drawer__title}>{title}</div>

          <IconButton ariaLabel={closeAriaLabel} onClick={close}>
            <CloseIcon className={styles.drawer__closeIcon} />
          </IconButton>
        </header>

        <div
          className={[
            styles.drawer__body,
            footer ? styles['drawer__body--withFooter'] : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>

        {footer && <div className={styles.drawer__footer}>{footer}</div>}
      </div>
    </div>
  )
}

export default Drawer
