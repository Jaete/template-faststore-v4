export interface ContactFormValues {
  name: string
  email: string
  message: string
}

export interface ContactFormProps {
  /** E-mail que vai receber a mensagem enviada */
  recipientEmail?: string
}

export type ContactFormErrors = Partial<
  Record<keyof ContactFormValues | 'recaptcha', string>
>

export type ContactFormStatus = 'idle' | 'loading' | 'success' | 'error'
