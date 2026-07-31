import { ChevronRightIcon } from '../../../../ui/Icons'
import type { ItemProps } from './Item.types'
import styles from './Item.module.scss'

function Item({
  label,
  href,
  expandable = false,
  active = false,
  variant = 'default',
}: ItemProps) {
  const className = [
    styles.item,
    active && styles['item--active'],
    variant === 'muted' && styles['item--muted'],
    variant === 'panel' && styles['item--panel'],
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <a href={href} className={className}>
      <span className={styles.item__label}>{label}</span>

      {expandable && <ChevronRightIcon className={styles.item__icon} />}
    </a>
  )
}

export default Item
