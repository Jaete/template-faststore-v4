import type { CheckboxProps } from './Checkbox.types'
import styles from './Checkbox.module.scss'

function Checkbox({ label, checked, onChange, count }: CheckboxProps) {
  return (
    <label className={styles.checkbox}>
      <input
        type="checkbox"
        className={styles.checkbox__input}
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.checkbox__box}>
        {checked && (
          <svg
            viewBox="0 0 12 10"
            fill="none"
            aria-hidden="true"
            className={styles.checkbox__check}
          >
            <path
              d="M1 5L4.5 8.5L11 1.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className={styles.checkbox__label}>{label}</span>
      {count !== undefined && (
        <span className={styles.checkbox__count}>({count})</span>
      )}
    </label>
  )
}

export default Checkbox
