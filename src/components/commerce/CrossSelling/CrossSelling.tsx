import Link from 'next/link'

import { EqualIcon, EyeIcon, PlusIcon, SyncIcon } from '../../ui/Icons'
import { useCrossSelling } from './useCrossSelling'
import type { CrossSellingProps } from './CrossSelling.types'
import styles from './CrossSelling.module.scss'

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/**
 * Vitrine "compre junto" da PDP: o produto atual seguido dos relacionados
 * cadastrados no admin da VTEX, encadeados por `+`, fechando num card de total
 * que adiciona o combo inteiro ao carrinho. Os produtos vêm do resolver
 * `crossSellingProducts` (`src/graphql/vtex/resolvers/crossSelling.ts`), já
 * resolvidos no servidor.
 */
function CrossSelling({
  title = 'Aproveite e compre junto',
  currentProductLabel = 'Você está vendo este produto',
  totalLabel = 'Leve os {count} itens por',
  buttonLabel = 'Comprar tudo',
}: CrossSellingProps) {
  const {
    items,
    toggleItem,
    cycleSlot,
    canCycle,
    selectedCount,
    totalSellingPrice,
    totalListPrice,
    hasDiscount,
    addComboToCart,
  } = useCrossSelling()

  // Sem pelo menos um produto indicado não existe "compre junto" — só o
  // produto da própria PDP não é uma oferta de combo.
  if (items.length < 2) {
    return null
  }

  return (
    <section className={styles.crossSelling}>
      <h2 className={styles.crossSelling__title}>{title}</h2>

      <div className={styles.crossSelling__content}>
        <div className={styles.crossSelling__list}>
          {items.map((item, index) => (
            <div key={index} className={styles.crossSelling__slot}>
              {index > 0 && (
                <span
                  className={styles.crossSelling__connector}
                  aria-hidden="true"
                >
                  <PlusIcon
                    className={styles.crossSelling__connectorIcon}
                    color="var(--cross-selling-connector-color)"
                  />
                </span>
              )}

              <article
                key={item.id}
                className={
                  item.isCurrentProduct
                    ? styles.crossSelling__card
                    : `${styles.crossSelling__card} ${styles['crossSelling__card--cycled']}`
                }
              >
                {item.isCurrentProduct && (
                  <div className={styles.crossSelling__currentBadge}>
                    <EyeIcon
                      className={styles.crossSelling__currentBadgeIcon}
                    />
                    <span>{currentProductLabel}</span>
                  </div>
                )}

                <div className={styles.crossSelling__imageContainer}>
                  <>
                    {!item.isCurrentProduct && (
                      <label className={styles.crossSelling__checkboxLabel}>
                        <input
                          type="checkbox"
                          className={styles.crossSelling__checkbox}
                          checked={item.selected}
                          onChange={() => toggleItem(item.id)}
                        />
                        <span className={styles.crossSelling__checkboxText}>
                          {item.name}
                        </span>
                      </label>
                    )}

                    {canCycle && item.slot !== undefined && (
                      <button
                        type="button"
                        className={styles.crossSelling__syncButton}
                        onClick={() => cycleSlot(item.slot as number)}
                        aria-label="Ver outra sugestão de produto"
                      >
                        <SyncIcon
                          className={styles.crossSelling__syncButtonIcon}
                        />
                      </button>
                    )}
                  </>

                  <img
                    className={styles.crossSelling__image}
                    src={item.image.src}
                    alt={item.image.alt}
                    loading="lazy"
                  />
                </div>

                <div className={styles.crossSelling__info}>
                  <h3 className={styles.crossSelling__name}>
                    <Link
                      href={item.href}
                      className={styles.crossSelling__nameLink}
                    >
                      {item.name}
                    </Link>
                  </h3>

                  <div className={styles.crossSelling__prices}>
                    {item.sellingPrice < item.listPrice && (
                      <span className={styles.crossSelling__listPrice}>
                        {priceFormatter.format(item.listPrice)}
                      </span>
                    )}
                    <span className={styles.crossSelling__sellingPrice}>
                      {priceFormatter.format(item.sellingPrice)}
                    </span>
                  </div>
                </div>
              </article>
            </div>
          ))}

          <div className={styles.crossSelling__slot}>
            <span className={styles.crossSelling__connector} aria-hidden="true">
              <EqualIcon
                className={styles.crossSelling__connectorIcon}
                color="var(--cross-selling-connector-color)"
              />
            </span>

            <div className={styles.crossSelling__total}>
              <p className={styles.crossSelling__totalLabel}>
                {totalLabel.replace('{count}', String(selectedCount))}
              </p>

              <div className={styles.crossSelling__totalPrices}>
                <strong className={styles.crossSelling__totalPrice}>
                  {priceFormatter.format(totalSellingPrice)}
                </strong>

                {hasDiscount && (
                  <span className={styles.crossSelling__totalListPrice}>
                    de {priceFormatter.format(totalListPrice)}
                  </span>
                )}
              </div>

              <button
                type="button"
                className={styles.crossSelling__button}
                onClick={addComboToCart}
                disabled={selectedCount === 0}
              >
                {buttonLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CrossSelling
