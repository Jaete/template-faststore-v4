import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useShippingSimulation_unstable as useShippingSimulation } from '@faststore/core/experimental'

import { usePriceFormatter } from 'src/sdk/product/useFormattedPrice'

import { formatShippingEstimatePtBR } from './formatShippingEstimate'
import type { ShippingRow } from './ShippingSimulator.types'

const INVALID_POSTAL_CODE_MESSAGE = 'CEP inválido ou não encontrado.'

function formatCEP(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 5) return numbers
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
}

function toPostalCodeInputEvent(value: string): ChangeEvent<HTMLInputElement> {
  return {
    currentTarget: { value },
    target: { value },
  } as ChangeEvent<HTMLInputElement>
}

function cleanShippingName(name: string): string {
  return name
    .replace(/_\d+$/, '')
    .replace(/\s*\([a-f0-9-]+\)\s*$/i, '')
    .trim()
}

interface SimulationSla {
  carrier?: string | null
  price?: number | null
  shippingEstimate?: string | null
  deliveryChannel?: string | null
}

function slaToRow(
  sla: SimulationSla,
  index: number,
  formatPrice: (price: number) => string
): ShippingRow {
  const price = sla.price ?? 0
  const name =
    (sla.carrier && cleanShippingName(sla.carrier)) ||
    (sla.deliveryChannel === 'pickup-in-point' ? 'Retirada em loja' : 'Entrega')
  const days = formatShippingEstimatePtBR(sla.shippingEstimate)
  const isFree = price === 0

  return {
    key: `${index}-${sla.deliveryChannel ?? 'd'}-${name}-${price}`,
    name,
    days,
    isFree,
    formattedPrice: isFree ? 'Grátis' : formatPrice(price),
  }
}

/**
 * Simulação de frete da PDP. Camada de UI + estado por cima do hook
 * experimental `useShippingSimulation_unstable`, seguindo o
 *
 * O hook do core dispara sozinho uma simulação no mount quando já existe
 * `postalCode` na sessão (geolocalização) — aqui isso é ignorado até o
 * usuário clicar em "Calcular": só então `hasSubmitted` vira `true` e a UI
 * passa a exibir resultado/erro.
 */
export function useShippingSimulator(sku: string, sellerId = '1') {
  const shippingItem = useMemo(
    () => ({ id: sku, seller: sellerId, quantity: 1 }),
    [sku, sellerId]
  )

  const {
    input,
    shippingSimulation,
    handleSubmit,
    handleOnInput,
    handleOnClear,
  } = useShippingSimulation({
    shippingItem,
    invalidPostalCodeErrorMessage: INVALID_POSTAL_CODE_MESSAGE,
  })

  const formatPrice = usePriceFormatter({ decimals: true })

  const [cep, setCep] = useState('')
  const [localError, setLocalError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const handleSubmitRef = useRef(handleSubmit)

  useEffect(() => {
    handleSubmitRef.current = handleSubmit
  }, [handleSubmit])

  const [submitNonce, setSubmitNonce] = useState(0)

  useEffect(() => {
    if (submitNonce === 0) return

    let cancelled = false

    const run = async () => {
      setIsSubmitting(true)
      try {
        await handleSubmitRef.current()
      } catch {
        if (!cancelled) {
          setLocalError(
            'Ocorreu um erro ao consultar o frete. Tente novamente.'
          )
        }
      } finally {
        if (!cancelled) {
          setIsSubmitting(false)
          setHasSubmitted(true)
        }
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [submitNonce])

  const onCepChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCep(formatCEP(event.target.value))
  }, [])

  const runCalculate = useCallback(() => {
    if (isSubmitting) return

    const cepNumbers = cep.replace(/\D/g, '')
    if (cepNumbers.length !== 8) {
      setLocalError('CEP inválido')
      return
    }

    setLocalError('')
    handleOnClear()
    handleOnInput(toPostalCodeInputEvent(cepNumbers))
    setSubmitNonce((n) => n + 1)
  }, [cep, handleOnClear, handleOnInput, isSubmitting])

  const slas = useMemo(() => {
    if (!hasSubmitted) return []

    const info = shippingSimulation?.logisticsInfo?.[0]
    const list = info?.slas as
      Array<SimulationSla | null | undefined> | null | undefined
    return list?.filter((s): s is SimulationSla => s != null) ?? []
  }, [shippingSimulation, hasSubmitted])

  const rows = useMemo(
    () => slas.map((sla, index) => slaToRow(sla, index, formatPrice)),
    [slas, formatPrice]
  )

  const hookError = input.errorMessage

  const emptyAfterFetch =
    hasSubmitted &&
    Boolean(shippingSimulation?.logisticsInfo?.[0]) &&
    rows.length === 0 &&
    !hookError

  const displayError =
    localError ||
    hookError ||
    (emptyAfterFetch
      ? 'Não foi possível encontrar opções de entrega para o CEP informado.'
      : '')

  return {
    cep,
    onCepChange,
    runCalculate,
    isSubmitting,
    hasSubmitted,
    rows,
    displayError,
  }
}
