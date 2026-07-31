import type { HelpButtonProps } from './HelpButton.types'
import styles from './HelpButton.module.scss'

function HelpButton({
  onClick,
  onHover,
  ariaLabel = 'Mais informações',
  disabled = false,
}: HelpButtonProps) {
  return (
    <button
      type="button"
      className={styles.helpButton}
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <span className={styles.helpButton__mark} aria-hidden="true">
        ?
      </span>
    </button>
  )
}

export default HelpButton
