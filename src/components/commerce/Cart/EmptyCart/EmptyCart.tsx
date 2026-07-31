import Button from '../../../ui/Button/Button'
import { dispatch, EventName } from '../../../../utils/events'
import type { EmptyCartProps } from './EmptyCart.types'
import styles from './EmptyCart.module.scss'

function EmptyCart({
  title = 'Seu carrinho está vazio',
  subtitle = 'Adicione produtos e eles aparecerão aqui',
  buttonLabel = 'Continuar comprando',
}: EmptyCartProps) {
  return (
    <div className={styles.emptyCart}>
      <div className={styles.emptyCart__text}>
        <p className={styles.emptyCart__title}>{title}</p>
        <p className={styles.emptyCart__subtitle}>{subtitle}</p>
      </div>

      <div className={styles.emptyCart__action}>
        <Button
          label={buttonLabel}
          variant="secondary"
          onClick={() => dispatch(EventName.CloseCartDrawer)}
        />
      </div>
    </div>
  )
}

export default EmptyCart
