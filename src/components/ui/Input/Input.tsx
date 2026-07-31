import { AlertCircleIcon, CheckCircleIcon } from '../Icons'
import type { InputProps } from './Input.types'
import styles from './Input.module.scss'

function Input({
  error = false,
  errorMessage,
  success = false,
  successMessage,
  messageVariant = 'default',
  className,
  children,
  ...props
}: InputProps) {
  const showSuccess = success && !error
  const fieldClassName = [
    styles.field,
    error ? styles['field--error'] : undefined,
    showSuccess ? styles['field--success'] : undefined,
  ]
    .filter(Boolean)
    .join(' ')
  const controlClassName = [styles.control, className].filter(Boolean).join(' ')

  const showErrorMessage = error && Boolean(errorMessage)
  const showSuccessMessage = showSuccess && Boolean(successMessage)
  const showFieldIcon = error && !errorMessage
  const messageClassName = [
    styles.message,
    showSuccessMessage ? styles['message--success'] : undefined,
    messageVariant === 'compact' ? styles['message--compact'] : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.wrapper}>
      <div className={fieldClassName}>
        <input
          className={controlClassName}
          aria-invalid={error || undefined}
          {...props}
        />
        {showFieldIcon && <AlertCircleIcon className={styles.fieldIcon} />}
        {children}
      </div>

      <span className={messageClassName}>
        {showErrorMessage && (
          <>
            <AlertCircleIcon className={styles.messageIcon} />
            {errorMessage}
          </>
        )}
        {showSuccessMessage && (
          <>
            <CheckCircleIcon className={styles['messageIcon--success']} />
            {successMessage}
          </>
        )}
      </span>
    </div>
  )
}

export default Input
