import { SpinnerIcon } from '../Icons'
import type { ButtonProps } from './Button.types'
import styles from './Button.module.scss'

function Button({
  label,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  href,
  type = 'button',
  onClick,
}: ButtonProps) {
  const className = [
    styles.button,
    styles[`button--${variant}`],
    disabled ? styles['button--disabled'] : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  const content = loading ? (
    <SpinnerIcon className={styles.button__spinner} />
  ) : (
    <>
      {icon && <span className={styles.button__icon}>{icon}</span>}
      <span>{label}</span>
    </>
  )

  if (href && !disabled && !loading) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={className}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={loading ? label : undefined}
      onClick={onClick}
    >
      {content}
    </button>
  )
}

export default Button
