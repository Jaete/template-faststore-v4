/**
 * A Catalog API da VTEX (`Dimension`/`RealDimension`) retorna medidas
 * lineares em centímetros e peso em gramas — não há unidade no payload, é
 * convenção implícita da API.
 */
export function formatLength(value?: number | null): string | undefined {
  if (!value) {
    return undefined
  }

  return `${value.toLocaleString('pt-BR')} cm`
}

export function formatWeight(value?: number | null): string | undefined {
  if (!value) {
    return undefined
  }

  const kg = value / 1000

  return `${kg.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg`
}
