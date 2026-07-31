import IconButton from '../../../../ui/IconButton/IconButton'
import { ShareIcon } from '../../../../ui/Icons'
import { dispatch, EventName } from '../../../../../utils/events'
import ShareModal from '../ShareModal/ShareModal'
import styles from './ShareButton.module.scss'

interface ShareButtonProps {
  /** Nome do produto, usado no texto de compartilhamento. */
  productName: string
}

/**
 * Botão de compartilhar na coluna de informações da PDP. Abre um modal com as
 * opções de compartilhamento (WhatsApp, Messenger e link direto).
 */
function ShareButton({ productName }: ShareButtonProps) {
  return (
    <>
      <IconButton
        ariaLabel="Compartilhar produto"
        onClick={() => dispatch(EventName.OpenShareModal)}
      >
        <ShareIcon className={styles.shareButton__icon} />
      </IconButton>

      <ShareModal productName={productName} />
    </>
  )
}

export default ShareButton
