import { useState } from 'react'

import Modal from '../../../../ui/Modal/Modal'
import { WhatsAppIcon, MessengerIcon, LinkIcon } from '../../../../ui/Icons'
import { dispatch, EventName } from '../../../../../utils/events'
import type { ShareModalProps } from './ShareModal.types'
import styles from './ShareModal.module.scss'

/** App ID público do Facebook para o diálogo do Messenger (share via URL). */
const FACEBOOK_APP_ID = ''

/**
 * Modal com as opções de compartilhamento da PDP. A abertura vem do
 * ShareButton via EventName.OpenShareModal; o modal só monta depois disso,
 * então `window.location.href` é lido na ação (sempre no cliente).
 */
function ShareModal({ productName }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const getUrl = () => window.location.href

  const openInNewTab = (target: string) => {
    window.open(target, '_blank', 'noopener,noreferrer')
    dispatch(EventName.CloseShareModal)
  }

  const shareWhatsApp = () =>
    openInNewTab(
      `https://wa.me/?text=${encodeURIComponent(`${productName} - ${getUrl()}`)}`
    )

  const shareMessenger = () => {
    const encoded = encodeURIComponent(getUrl())

    openInNewTab(
      `https://www.facebook.com/dialog/send?link=${encoded}` +
        `&app_id=${FACEBOOK_APP_ID}&redirect_uri=${encoded}`
    )
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl())
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Modal
      openEventName={EventName.OpenShareModal}
      closeEventName={EventName.CloseShareModal}
      title="Compartilhar"
      closeAriaLabel="Fechar compartilhamento"
      // O modal desmonta ao fechar, mas o React preserva o state enquanto o
      // elemento continua na árvore — sem isto, reabrir mostraria "Link
      // copiado!" de um compartilhamento anterior.
      onClose={() => setCopied(false)}
    >
      <div className={styles.shareModal__options}>
        <button
          type="button"
          className={styles.shareModal__option}
          onClick={shareWhatsApp}
        >
          <WhatsAppIcon className={styles.shareModal__optionIcon} />
          <span className={styles.shareModal__optionLabel}>WhatsApp</span>
        </button>

        <button
          type="button"
          className={styles.shareModal__option}
          onClick={shareMessenger}
        >
          <MessengerIcon className={styles.shareModal__optionIcon} />
          <span className={styles.shareModal__optionLabel}>Messenger</span>
        </button>

        <button
          type="button"
          className={styles.shareModal__option}
          onClick={copyLink}
        >
          <LinkIcon className={styles.shareModal__optionIcon} />
          <span className={styles.shareModal__optionLabel}>
            {copied ? 'Link copiado!' : 'Copiar link'}
          </span>
        </button>
      </div>
    </Modal>
  )
}

export default ShareModal
