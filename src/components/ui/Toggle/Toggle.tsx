import type { ToggleProps } from './Toggle.types'
import { useToggle } from './useToggle'
import styles from './Toggle.module.scss'

function Toggle({
  onToggle,
  on,
  defaultOn,
  disabled = false,
  id,
  className,
  'aria-label': ariaLabel,
}: ToggleProps) {
  const { isOn, toggle } = useToggle({ on, defaultOn, onToggle })

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={isOn}
      aria-label={ariaLabel}
      disabled={disabled}
      className={[styles.toggle, isOn ? styles['toggle--on'] : '', className]
        .filter(Boolean)
        .join(' ')}
      onClick={toggle}
    >
      <span className={styles.toggle__knob} />
    </button>
  )
}

export default Toggle
