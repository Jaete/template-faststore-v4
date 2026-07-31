import ContactMethod from '../ContactMethod/ContactMethod'
import { MailIcon, PhoneIcon } from '../../../ui/Icons'
import type { InstitutionalPageContactMethodIcon } from '../InstitutionalPage.types'
import type { ContactMethodsProps } from './ContactMethods.types'
import styles from '../InstitutionalPage.module.scss'

const CONTACT_METHOD_ICONS: Partial<
  Record<InstitutionalPageContactMethodIcon, typeof PhoneIcon>
> = {
  phone: PhoneIcon,
  email: MailIcon,
}

function ContactMethods({ title, methods }: ContactMethodsProps) {
  if (methods.length === 0) {
    return null
  }

  return (
    <div className={styles.institutionalPage__contactMethods}>
      {title && (
        <p className={styles.institutionalPage__contactMethodsTitle}>{title}</p>
      )}

      <div className={styles.institutionalPage__contactMethodsList}>
        {methods.map((method, index) => (
          <ContactMethod
            key={index}
            icon={method.icon ? CONTACT_METHOD_ICONS[method.icon] : undefined}
            iconUrl={method.customIconUrl}
            label={method.label}
            href={method.href}
          />
        ))}
      </div>
    </div>
  )
}

export default ContactMethods
