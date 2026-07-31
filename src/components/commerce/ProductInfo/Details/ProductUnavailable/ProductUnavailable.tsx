import { useState } from 'react'

import { usePDP } from 'src/sdk/overrides/PageProvider'

import { useActiveSku } from '../../../../providers/ActiveSkuProvider/ActiveSkuProvider'
import Input from '../../../../ui/Input/Input'
import Button from '../../../../ui/Button/Button'
import { useProductUnavailable } from './useProductUnavailable'
import type { ProductUnavailableProps } from './ProductUnavailable.types'
import styles from './ProductUnavailable.module.scss'

/**
 * Bloco "Avise-me". Substitui o `BuyBlock` quando o SKU ativo
 *  não tem estoque — ver o switch em `Details.tsx`.
 */
function ProductUnavailable({ className }: ProductUnavailableProps) {
  const { activeSku } = useActiveSku()
  const groupProduct = usePDP()?.data?.product
  const { notifyMe, isSubmitting, status } = useProductUnavailable()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const succeeded = await notifyMe(name, email, activeSku)

    if (succeeded) {
      setName('')
      setEmail('')
    }
  }

  const isSuccess = status === 'success'
  const isError = status === 'error'

  return (
    <div
      className={[styles.productUnavailable, className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.productUnavailable__desc}>
        <p className={styles.productUnavailable__title}>Produto indisponível</p>
        <p className={styles.productUnavailable__description}>
          Preencha seus dados e avisaremos por e-mail assim que{' '}
          {groupProduct?.isVariantOf?.name ?? 'o produto'} estiver disponível.
        </p>
      </div>

      <form className={styles.productUnavailable__form} onSubmit={handleSubmit}>
        <div className={styles.productUnavailable__row}>
          <div className={styles.productUnavailable__field}>
            <Input
              type="text"
              name="name"
              placeholder="Nome"
              aria-label="Nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className={styles.productUnavailable__field}>
            <Input
              type="email"
              name="email"
              placeholder="E-mail"
              aria-label="E-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>

        <Button
          label="Enviar"
          variant="primary"
          type="submit"
          loading={isSubmitting}
        />

        <p role="status" className={styles.productUnavailable__status}>
          {isSuccess &&
            'E-mail cadastrado! Você será avisado quando o produto estiver disponível.'}
          {isError && 'Não foi possível cadastrar agora. Tente novamente.'}
        </p>
      </form>
    </div>
  )
}

export default ProductUnavailable
