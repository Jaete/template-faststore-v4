import { useShippingSimulator } from './useShippingSimulator'
import type { ShippingSimulatorProps } from './ShippingSimulator.types'
import styles from './ShippingSimulator.module.scss'

const CORREIOS_CEP_URL =
  'https://buscacepinter.correios.com.br/app/endereco/index.php'

/**
 * Simulador de frete da PDP.
 * Sem accordion: título + input de CEP + "Calcular" + link "Não sei meu cep" sempre visíveis;
 * o resultado (lista de opções, cada uma um bloco) aparece
 * abaixo conforme o estado da simulação.
 */
function ShippingSimulator({
  sku,
  sellerId,
  className,
}: ShippingSimulatorProps) {
  const { cep, onCepChange, runCalculate, isSubmitting, rows, displayError } =
    useShippingSimulator(sku, sellerId)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      runCalculate()
    }
  }

  return (
    <div
      className={[styles.shippingSimulator, className]
        .filter(Boolean)
        .join(' ')}
    >
      <p className={styles.shippingSimulator__title}>Cálculo de frete</p>

      <div className={styles.shippingSimulator__inputRow}>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Digite seu cep"
          aria-label="CEP"
          className={styles.shippingSimulator__input}
          value={cep}
          onChange={onCepChange}
          onKeyDown={handleKeyDown}
          maxLength={9}
        />

        <button
          type="button"
          className={styles.shippingSimulator__calculate}
          onClick={runCalculate}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Calculando...' : 'Calcular'}
        </button>
      </div>

      <a
        href={CORREIOS_CEP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.shippingSimulator__helpLink}
      >
        Não sei meu cep
      </a>

      {displayError && (
        <p role="alert" className={styles.shippingSimulator__error}>
          {displayError}
        </p>
      )}

      {rows.length > 0 && (
        <ul className={styles.shippingSimulator__results}>
          {rows.map((row) => (
            <li key={row.key} className={styles.shippingSimulator__option}>
              <span className={styles.shippingSimulator__optionName}>
                {row.name}
              </span>
              {row.days && (
                <span className={styles.shippingSimulator__optionDays}>
                  {row.days}
                </span>
              )}
              <span className={styles.shippingSimulator__optionPrice}>
                {row.formattedPrice}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ShippingSimulator
