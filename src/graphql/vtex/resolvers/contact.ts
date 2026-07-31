import nodemailer from 'nodemailer'

interface SendContactMessageArgs {
  name: string
  email: string
  message: string
  to: string
  recaptchaToken: string
}

interface RecaptchaAssessmentResponse {
  tokenProperties?: {
    valid?: boolean
    action?: string
  }
  riskAnalysis?: {
    score?: number
  }
}

// Mesma action passada em `grecaptcha.enterprise.render` no ContactForm —
// tem que bater, senão `tokenProperties.action` diverge e a assessment é
// tratada como possível falsificação.
const RECAPTCHA_EXPECTED_ACTION = 'CONTACT_FORM_SUBMIT'
const RECAPTCHA_SCORE_THRESHOLD = 0.5

// Mesma site key usada em useContactForm.ts — pública por design, não é
// segredo, por isso vai no `vtex.env` com o prefixo NEXT_PUBLIC_ (o cliente
// precisa dela para renderizar o widget).
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''

/** Remetente e assunto dos e-mails do formulário de contato. */
const CONTACT_FORM_SENDER_NAME =
  process.env.CONTACT_FORM_SENDER_NAME || 'Fale Conosco'

async function verifyRecaptcha(token: string): Promise<boolean> {
  const projectId = process.env.RECAPTCHA_PROJECT_ID
  const apiKey = process.env.RECAPTCHA_API_KEY

  if (!projectId || !apiKey) {
    throw new Error('reCAPTCHA Enterprise não configurado.')
  }

  const response = await fetch(
    `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: {
          token,
          siteKey: RECAPTCHA_SITE_KEY,
          expectedAction: RECAPTCHA_EXPECTED_ACTION,
        },
      }),
    }
  )

  const data = (await response.json()) as RecaptchaAssessmentResponse

  if (!data.tokenProperties?.valid) {
    return false
  }

  if (data.tokenProperties.action !== RECAPTCHA_EXPECTED_ACTION) {
    return false
  }

  return (data.riskAnalysis?.score ?? 0) >= RECAPTCHA_SCORE_THRESHOLD
}

const contactResolver = {
  Mutation: {
    sendContactMessage: async (
      _: unknown,
      { name, email, message, to, recaptchaToken }: SendContactMessageArgs
    ) => {
      const isHuman = await verifyRecaptcha(recaptchaToken)

      if (!isHuman) {
        throw new Error('Falha na validação do reCAPTCHA.')
      }

      const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env

      if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
        throw new Error('SMTP não configurado.')
      }

      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASSWORD,
        },
      })

      await transporter.sendMail({
        from: `"${CONTACT_FORM_SENDER_NAME}" <${SMTP_USER}>`,
        to,
        replyTo: email,
        subject: `${name} via ${CONTACT_FORM_SENDER_NAME}`,
        text: `Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`,
      })

      return true
    },
  },
}

export default contactResolver
