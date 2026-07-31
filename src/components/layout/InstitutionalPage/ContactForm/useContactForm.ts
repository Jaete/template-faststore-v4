import { useCallback, useRef, useState } from 'react'
import { gql } from '@faststore/core/api'
import { useLazyQuery_unstable as useLazyQuery } from '@faststore/core/experimental'
import type {
  ContactFormErrors,
  ContactFormStatus,
  ContactFormValues,
} from './ContactForm.types'

const SendContactMessageMutation = gql(`
  mutation SendContactMessage($name: String!, $email: String!, $message: String!, $to: String!, $recaptchaToken: String!) {
    sendContactMessage(name: $name, email: $email, message: $message, to: $to, recaptchaToken: $recaptchaToken)
  }
`)

interface SendContactMessageData {
  sendContactMessage: boolean
}

interface SendContactMessageVariables {
  name: string
  email: string
  message: string
  to: string
  recaptchaToken: string
}

// Site key do reCAPTCHA Enterprise — pública por design (o Google já espera
// que ela apareça no HTML/JS do navegador), por isso o prefixo NEXT_PUBLIC_.
// Sem ela configurada, o widget não é renderizado e o form segue sem captcha.
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''
const RECAPTCHA_ACTION = 'CONTACT_FORM_SUBMIT'

const INITIAL_VALUES: ContactFormValues = {
  name: '',
  email: '',
  message: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {}

  if (!values.email.trim()) {
    errors.email = 'Informe seu e-mail.'
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (!values.message.trim()) {
    errors.message = 'Escreva sua mensagem.'
  }

  return errors
}

interface UseContactFormParams {
  recipientEmail?: string
}

export function useContactForm({ recipientEmail }: UseContactFormParams) {
  const [executeSendContactMessage] = useLazyQuery<
    SendContactMessageData,
    SendContactMessageVariables
  >(SendContactMessageMutation, {
    name: '',
    email: '',
    message: '',
    to: '',
    recaptchaToken: '',
  })

  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [status, setStatus] = useState<ContactFormStatus>('idle')

  const recaptchaContainerRef = useRef<HTMLDivElement>(null)
  const recaptchaWidgetId = useRef<number | null>(null)

  const changeField = useCallback(
    (field: keyof ContactFormValues, value: string) => {
      setValues((current) => ({ ...current, [field]: value }))
      setErrors((current) => ({ ...current, [field]: undefined }))
    },
    []
  )

  const handleRecaptchaLoad = useCallback(() => {
    if (!RECAPTCHA_SITE_KEY || recaptchaWidgetId.current !== null) {
      return
    }

    window.grecaptcha.enterprise.ready(() => {
      if (
        !recaptchaContainerRef.current ||
        recaptchaWidgetId.current !== null
      ) {
        return
      }

      recaptchaWidgetId.current = window.grecaptcha.enterprise.render(
        recaptchaContainerRef.current,
        { sitekey: RECAPTCHA_SITE_KEY, action: RECAPTCHA_ACTION }
      )
    })
  }, [])

  const submit = useCallback(async () => {
    const validationErrors = validate(values)

    const recaptchaToken =
      recaptchaWidgetId.current !== null
        ? window.grecaptcha.enterprise.getResponse(recaptchaWidgetId.current)
        : ''

    if (RECAPTCHA_SITE_KEY && !recaptchaToken) {
      validationErrors.recaptcha = 'Confirme que você não é um robô.'
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    if (!recipientEmail) {
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const data = await executeSendContactMessage({
        ...values,
        to: recipientEmail,
        recaptchaToken,
      })

      if (!data?.sendContactMessage) {
        throw new Error('Falha ao enviar')
      }

      setStatus('success')
      setValues(INITIAL_VALUES)
    } catch {
      setStatus('error')
    } finally {
      if (recaptchaWidgetId.current !== null) {
        window.grecaptcha.enterprise.reset(recaptchaWidgetId.current)
      }
    }
  }, [values, recipientEmail, executeSendContactMessage])

  return {
    values,
    errors,
    status,
    changeField,
    submit,
    recaptchaContainerRef,
    handleRecaptchaLoad,
  }
}
