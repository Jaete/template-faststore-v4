import { useCallback, useState } from 'react'
import { gql } from '@faststore/core/api'
import { useLazyQuery_unstable as useLazyQuery } from '@faststore/core/experimental'

interface ProductUnavailableData {
  productUnavailable: { status: string }
}

interface ProductUnavailableVariables {
  input: { name: string; email: string; sku: string }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- @ts-ignore é intencional aqui
// @ts-ignore
const ProductUnavailableMutation = gql(`
  mutation ProductUnavailable($input: ProductUnavailableInput!) {
    productUnavailable(input: $input) {
      status
    }
  }
`)

export type ProductUnavailableStatus =
  'idle' | 'submitting' | 'success' | 'error'

/**
 * Cadastro de aviso de reposição do SKU sem estoque, via a mutation
 * customizada `productUnavailable` (src/graphql/thirdParty).
 */
export function useProductUnavailable() {
  const [executeNotifyMe] = useLazyQuery<
    ProductUnavailableData,
    ProductUnavailableVariables
  >(ProductUnavailableMutation, { input: { name: '', email: '', sku: '' } })

  const [status, setStatus] = useState<ProductUnavailableStatus>('idle')

  const notifyMe = useCallback(
    async (name: string, email: string, sku: string) => {
      setStatus('submitting')

      try {
        const data = await executeNotifyMe({ input: { name, email, sku } })

        if (data?.productUnavailable?.status !== 'success') {
          throw new Error('Invalid response')
        }

        setStatus('success')
        return true
      } catch {
        setStatus('error')
        return false
      }
    },
    [executeNotifyMe]
  )

  return {
    status,
    isSubmitting: status === 'submitting',
    notifyMe,
  }
}
