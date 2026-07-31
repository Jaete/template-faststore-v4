import Script from 'next/script'
import type { FormEvent } from 'react'
import Button from '../../../ui/Button/Button'
import Input from '../../../ui/Input/Input'
import type { ContactFormProps } from './ContactForm.types'
import { useContactForm } from './useContactForm'
import styles from './ContactForm.module.scss'

function ContactForm({ recipientEmail }: ContactFormProps) {
  const {
    values,
    errors,
    status,
    changeField,
    submit,
    recaptchaContainerRef,
    handleRecaptchaLoad,
  } = useContactForm({
    recipientEmail,
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submit()
  }

  return (
    <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
      <div className={styles.contactForm__field}>
        <label
          className={styles.contactForm__label}
          htmlFor="contact-form-name"
        >
          Nome
        </label>
        <Input
          id="contact-form-name"
          name="name"
          className={styles.contactForm__input}
          placeholder="Digite seu nome"
          value={values.name}
          error={!!errors.name}
          errorMessage={errors.name}
          onChange={(event) => changeField('name', event.target.value)}
        />
      </div>

      <div className={styles.contactForm__field}>
        <label
          className={styles.contactForm__label}
          htmlFor="contact-form-email"
        >
          Email
          <span className={styles.contactForm__required}>Obrigatório</span>
        </label>
        <Input
          id="contact-form-email"
          name="email"
          type="email"
          className={styles.contactForm__input}
          placeholder="email@gmail.com.br"
          value={values.email}
          error={!!errors.email}
          errorMessage={errors.email}
          onChange={(event) => changeField('email', event.target.value)}
        />
      </div>

      <div className={styles.contactForm__field}>
        <label
          className={styles.contactForm__label}
          htmlFor="contact-form-message"
        >
          Mensagem
        </label>
        <textarea
          id="contact-form-message"
          className={[
            styles.contactForm__textarea,
            errors.message ? styles['contactForm__textarea--error'] : '',
          ]
            .filter(Boolean)
            .join(' ')}
          name="message"
          placeholder="digite sua mensagem"
          rows={5}
          value={values.message}
          onChange={(event) => changeField('message', event.target.value)}
        />
        {errors.message && (
          <span className={styles.contactForm__errorMessage}>
            {errors.message}
          </span>
        )}
      </div>

      <div className={styles.contactForm__field}>
        <div ref={recaptchaContainerRef} />
        {errors.recaptcha && (
          <span className={styles.contactForm__errorMessage}>
            {errors.recaptcha}
          </span>
        )}
      </div>

      <div className={styles.contactForm__submitButton}>
        <Button
          type="submit"
          label="Enviar"
          variant="secondary"
          loading={status === 'loading'}
        />
      </div>

      {status === 'success' && (
        <p className={styles.contactForm__feedback}>
          Mensagem enviada com sucesso!
        </p>
      )}

      {status === 'error' && (
        <p className={styles['contactForm__feedback--error']}>
          Não foi possível enviar sua mensagem. Tente novamente.
        </p>
      )}

      <Script
        src="https://www.google.com/recaptcha/enterprise.js"
        strategy="afterInteractive"
        onLoad={handleRecaptchaLoad}
      />
    </form>
  )
}

export default ContactForm
