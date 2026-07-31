import Banner from '../Navigation/Banner/Banner'
import Item from '../Navigation/Item/Item'
import type {
  HeaderMegaMenuConfig,
  HeaderNavigationItem,
} from '../Header.types'
import { hasContent, useMegaMenu } from './useMegaMenu'
import styles from './MegaMenu.module.scss'

interface MegaMenuProps {
  /** Item da navegação principal dono do painel (nível 0) */
  item: HeaderNavigationItem
  /** Comportamento do painel, definido no CMS (repassado do Header) */
  config?: HeaderMegaMenuConfig
}

function MegaMenu({ item, config }: MegaMenuProps) {
  const { showSeeAll = true, seeAllLabel = 'Ver tudo' } = config ?? {}
  const {
    departments,
    activeDepartment,
    activeCategory,
    activeSubcategory,
    department,
    categories,
    category,
    subcategories,
    openDepartment,
    openCategory,
    openSubcategory,
    revealedBanner,
    visibleBanners,
    isFullWidthBanners,
  } = useMegaMenu({ item })

  return (
    <>
      {departments.length > 0 && (
        <ul className={styles.departments}>
          {departments.map((node, index) => (
            <li
              key={node.href}
              onMouseEnter={() => openDepartment(index)}
              onFocus={() => openDepartment(index)}
            >
              <Item
                label={node.label}
                href={node.href}
                expandable={hasContent(node)}
                active={index === activeDepartment}
              />
            </li>
          ))}
        </ul>
      )}

      {categories && department ? (
        <div className={styles.categories}>
          <section className={styles.categoryGroup}>
            <h3 className={styles.categoryGroupTitle}>{department.label}</h3>

            <ul className={styles.categoryGroupList}>
              {categories.map((node, index) => (
                <li
                  key={node.href}
                  onMouseEnter={() => openCategory(index)}
                  onFocus={() => openCategory(index)}
                >
                  <Item
                    label={node.label}
                    href={node.href}
                    expandable={hasContent(node)}
                    active={index === activeCategory}
                    variant="muted"
                  />
                </li>
              ))}
            </ul>

            {showSeeAll && (
              <a href={department.href} className={styles.categoryGroupAll}>
                {seeAllLabel}
              </a>
            )}
          </section>

          {subcategories && category && (
            <section className={styles.subcategoryGroup}>
              <ul className={styles.categoryGroupList}>
                {subcategories.map((node, index) => (
                  <li
                    key={node.href}
                    onMouseEnter={() => openSubcategory(index)}
                    onFocus={() => openSubcategory(index)}
                  >
                    <Item
                      label={node.label}
                      href={node.href}
                      active={index === activeSubcategory}
                      variant="panel"
                    />
                  </li>
                ))}
              </ul>

              {showSeeAll && (
                <a href={category.href} className={styles.categoryGroupAll}>
                  {seeAllLabel}
                </a>
              )}
            </section>
          )}

          {revealedBanner && (
            <a
              href={revealedBanner.href}
              className={styles.categoryBanner}
              aria-label={revealedBanner.label}
            >
              <img
                src={revealedBanner.imageSrc}
                alt={revealedBanner.imageAlt ?? ''}
                loading="lazy"
              />
            </a>
          )}
        </div>
      ) : (
        Boolean(visibleBanners?.length) && (
          <div
            className={
              isFullWidthBanners
                ? `${styles.banners} ${styles['banners--full']}`
                : styles.banners
            }
          >
            {visibleBanners?.map((banner) => (
              <Banner {...banner} key={banner.href} />
            ))}
          </div>
        )
      )}
    </>
  )
}

export default MegaMenu
