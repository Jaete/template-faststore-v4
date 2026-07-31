/**
 * Traduz o `shippingEstimate` da VTEX (`5bd`, `2d`, `3h`, `10m`) para pt-BR.
 * Formato documentado em shipping-simulator.md (passo 8).
 */
export function formatShippingEstimatePtBR(estimate?: string | null): string {
  if (!estimate) return ''

  const match = estimate.match(/^(\d+)(bd|d|h|m)$/)
  if (!match) return estimate

  const value = Number(match[1])
  const unit = match[2]

  if (unit === 'bd') {
    return value === 1 ? 'Em até 1 dia útil' : `Em até ${value} dias úteis`
  }

  if (unit === 'd') {
    if (value === 0) return 'Hoje'
    return value === 1 ? 'Em até 1 dia' : `Em até ${value} dias`
  }

  if (unit === 'h') {
    if (value === 0) return 'Hoje'
    return value === 1 ? 'Em até 1 hora' : `Em até ${value} horas`
  }

  // 'm'
  if (value === 0) return 'Hoje'
  return value === 1 ? 'Em até 1 minuto' : `Em até ${value} minutos`
}
