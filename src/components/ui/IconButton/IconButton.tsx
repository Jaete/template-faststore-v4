import type { IconButtonProps } from './IconButton.types'
import styles from './IconButton.module.scss'

function IconButton({
  children,
  ariaLabel,
  disabled = false,
  type = 'button',
  onClick,
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={styles.iconButton}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default IconButton
