/**
 * Tipagem mínima do script client-side do Google reCAPTCHA Enterprise
 * (`https://www.google.com/recaptcha/enterprise.js`), carregado via <Script>
 * no ContactForm. Cobre só a superfície usada: render explícito do widget de
 * checkbox, ready (fila de carregamento) e leitura/reset do token.
 */
interface GrecaptchaRenderOptions {
  sitekey: string
  action?: string
  theme?: 'light' | 'dark'
}

interface GrecaptchaEnterprise {
  ready(callback: () => void): void
  render(container: HTMLElement, options: GrecaptchaRenderOptions): number
  getResponse(widgetId?: number): string
  reset(widgetId?: number): void
}

interface Window {
  grecaptcha: {
    enterprise: GrecaptchaEnterprise
  }
}
