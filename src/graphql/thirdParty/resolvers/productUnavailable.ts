import storeConfig from '../../../../discovery.config'

interface ProductUnavailableInput {
  name: string
  email: string
  sku: string
}

interface ProductUnavailableResolverContext {
  headers: Record<string, string>
}

/**
 * Cliente HTTP do endpoint legado de "Avise-me" da VTEX. Espera
 * `application/x-www-form-urlencoded`, não JSON — daí `URLSearchParams` em vez
 * de `JSON.stringify`.
 */
async function submitProductUnavailableForm(
  { name, email, sku }: ProductUnavailableInput,
  ctx: ProductUnavailableResolverContext
) {
  const base = `https://${storeConfig.api.storeId}.${storeConfig.api.environment}.com.br`
  const cookie = ctx.headers?.cookie ?? ''
  const host = ctx.headers?.host ?? ''

  const body = new URLSearchParams({
    notifymeClientName: name,
    notifymeClientEmail: email,
    notifymeIdSku: sku,
  })

  const response = await fetch(`${base}/no-cache/AviseMe.aspx`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      ...(cookie ? { Cookie: cookie } : {}),
      ...(host ? { 'X-FORWARDED-HOST': host } : {}),
    },
    body: body.toString(),
  })

  if (!response.ok) {
    throw new Error('Error submitting product unavailable form')
  }
}

const productUnavailableResolver = {
  Mutation: {
    // O resolver nunca propaga a exceção para o cliente: erros são logados no
    // servidor e convertidos em `status: "error"`, que o formulário traduz
    // numa mensagem genérica de "tente novamente".
    productUnavailable: async (
      _: unknown,
      { input }: { input: ProductUnavailableInput },
      ctx: ProductUnavailableResolverContext
    ) => {
      try {
        await submitProductUnavailableForm(input, ctx)

        return { status: 'success' }
      } catch (e) {
        console.error('Erro Avise-me ', e)

        return { status: 'error' }
      }
    },
  },
}

export default productUnavailableResolver
