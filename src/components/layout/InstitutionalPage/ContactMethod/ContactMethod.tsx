import type { ContactMethodProps } from './ContactMethod.types'
import styles from './ContactMethod.module.scss'

function ContactMethod({
  icon: Icon,
  iconUrl,
  label,
  href,
}: ContactMethodProps) {
  const content = (
    <>
      {(iconUrl || Icon) && (
        <span className={styles.contactMethod__icon}>
          {iconUrl ? (
            <img
              src={iconUrl}
              alt=""
              className={styles.contactMethod__iconSvg}
            />
          ) : (
            Icon && <Icon className={styles.contactMethod__iconSvg} />
          )}
        </span>
      )}
      <span className={styles.contactMethod__label}>{label}</span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={styles.contactMethod}>
        {content}
      </a>
    )
  }

  return <div className={styles.contactMethod}>{content}</div>
}

export default ContactMethod
