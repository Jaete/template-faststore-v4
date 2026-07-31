/**
 * Utilitários do `slugsMap` de variações de SKU.
 *
 * Formato das chaves (ver `createSlugsMap` em
 * `@faststore/api/src/platforms/vtex/utils/skuVariants.ts`): o combo COMPLETO de
 * todas as dimensões do SKU, concatenado como `Nome-Valor` e separado por `-`,
 * com a variação dominante sempre primeiro. Os valores entram crus, sem
 * slugificação:
 *
 *   "TAMANHO-170 cm-COR-Azul Marinho-ACABAMENTO-Fosco"
 *
 * Consequência importante: `-` NÃO é um delimitador confiável, porque nomes e
 * valores podem conter hífens, espaços, `:` e `/`. Por isso nada aqui faz
 * `split('-')` — a extração usa os nomes de dimensão conhecidos como âncoras.
 */

/** Slice mínimo de um SKU para responder sobre estoque e variações. */
interface VariantLike {
  offers?: {
    offers?: Array<{ availability?: string; quantity?: number }>
  }
  additionalProperty?: Array<{
    name: string
    value: unknown
    valueReference: unknown
  }>
}

/** Marca que a API usa nas `additionalProperty` que são variações de SKU. */
const SPECIFICATION_REFERENCE = 'SPECIFICATION'

/**
 * `true` quando o SKU tem estoque em pelo menos um seller.
 *
 * `availability` é do vocabulário schema.org e a API devolve a URL completa
 * (`https://schema.org/InStock`) — daí o `endsWith` em vez de igualdade. A
 * `quantity` entra na conta porque a VTEX às vezes devolve `InStock` com saldo
 * zero em SKU recém-esgotado.
 */
export function isVariantInStock(variant: VariantLike | undefined | null) {
  return Boolean(
    variant?.offers?.offers?.some(
      (offer) =>
        offer.availability?.endsWith('InStock') && (offer.quantity ?? 0) > 0
    )
  )
}

/**
 * Extrai as variações de um SKU a partir das suas `additionalProperty` — a
 * mesma fonte de que a API constrói o `slugsMap`, mas devolvendo o objeto do
 * SKU num passo só.
 */
export function readVariantVariations(
  variant: Pick<VariantLike, 'additionalProperty'>,
  dimensionNames: string[]
) {
  const variations: Record<string, string> = {}

  for (const property of variant.additionalProperty ?? []) {
    if (
      property.valueReference === SPECIFICATION_REFERENCE &&
      dimensionNames.includes(property.name)
    ) {
      variations[property.name] = String(property.value)
    }
  }

  return variations
}

/** Normalização tolerante para comparar nomes/valores vindos de fontes distintas. */
export function slugifyVariant(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Escapa uma string para uso literal dentro de uma RegExp. */
function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Decompõe uma chave do `slugsMap` em pares dimensão→valor.
 *
 * Como não há delimitador escapável, os nomes de dimensão (que vêm de
 * `availableVariations`) são usados como âncoras: localiza-se cada `Nome-` na
 * chave e o valor é o texto até o início da próxima âncora. Isso é robusto a
 * valores com hífen ("170 cm", "Azul Marinho") e independe da ordem das dimensões,
 * que varia conforme a dominante do produto.
 *
 * Retorna `null` se alguma dimensão não for encontrada na chave — sinal de que a
 * chave não descreve o mesmo conjunto de dimensões e não deve ser comparada.
 */
export function parseSlugsMapKey(
  key: string,
  dimensionNames: string[]
): Record<string, string> | null {
  // Posição de cada âncora "Nome-" na chave.
  const anchors: Array<{ name: string; start: number; valueStart: number }> = []

  for (const name of dimensionNames) {
    const match = new RegExp(`(^|-)${escapeRegExp(name)}-`).exec(key)

    if (!match) {
      return null
    }

    // `match.index` aponta para o separador quando não é o início da chave.
    const start = match.index + (match[1] ? match[1].length : 0)

    anchors.push({ name, start, valueStart: start + name.length + 1 })
  }

  anchors.sort((a, b) => a.start - b.start)

  const parsed: Record<string, string> = {}

  anchors.forEach((anchor, index) => {
    const next = anchors[index + 1]
    // O valor termina onde a próxima âncora começa, descontando o `-` que as
    // separa; na última, vai até o fim da chave.
    const end = next ? next.start - 1 : key.length

    parsed[anchor.name] = key.slice(anchor.valueStart, end)
  })

  return parsed
}

/**
 * Resolve o slug do SKU que corresponde exatamente a um combo de variações.
 *
 * `desiredVariations` deve conter TODAS as dimensões do produto — normalmente as
 * `activeVariations` do SKU aberto com uma dimensão substituída pelo valor que o
 * usuário clicou. É isso que faz o seletor ser composto: as demais dimensões são
 * preservadas em vez de reescolhidas pelo catálogo.
 *
 * A comparação é normalizada (`slugifyVariant`) para tolerar diferenças de
 * acento/caixa/espaço entre `activeVariations` e as chaves do mapa.
 */
export function resolveSlugForVariations(
  slugsMap: Record<string, string>,
  desiredVariations: Record<string, string>
): string | undefined {
  const dimensionNames = Object.keys(desiredVariations)

  if (dimensionNames.length === 0) {
    return undefined
  }

  const target = dimensionNames
    .map(
      (name) =>
        `${slugifyVariant(name)}:${slugifyVariant(desiredVariations[name])}`
    )
    .sort()
    .join('|')

  for (const [key, slug] of Object.entries(slugsMap)) {
    const parsed = parseSlugsMapKey(key, dimensionNames)

    if (!parsed) {
      continue
    }

    const candidate = dimensionNames
      .map((name) => `${slugifyVariant(name)}:${slugifyVariant(parsed[name])}`)
      .sort()
      .join('|')

    if (candidate === target) {
      return slug
    }
  }

  return undefined
}

/**
 * Melhor SKU para um valor de dimensão, preservando o máximo possível da seleção
 * atual das OUTRAS dimensões.
 *
 * É a peça que evita o beco sem saída do seletor composto: se COR=Azul não
 * existe no TAMANHO atual, em vez de o clique ser um no-op (ou o chip
 * desaparecer), escolhe-se o SKU azul que mais combina com o resto da seleção —
 * na prática, o tamanho se reajusta sozinho.
 *
 * Critério: entre os SKUs que têm `dimensionName = value`, ganha o que casar com
 * mais dimensões de `preferredVariations`. Empate resolve pela ordem de
 * `variants` (a dominante do catálogo vem primeiro), então o resultado é estável.
 * Com estoque como critério de desempate ANTES da ordem: entre dois SKUs
 * igualmente próximos, o que tem estoque é sempre a melhor resposta ao clique.
 *
 * Retorna `undefined` só quando nenhum SKU tem aquele valor na dimensão.
 */
export function findBestVariantForValue<T extends VariantLike>(
  variants: readonly T[],
  dimensionNames: string[],
  preferredVariations: Record<string, string>,
  dimensionName: string,
  value: string
): T | undefined {
  const targetValue = slugifyVariant(value)
  // As outras dimensões: a própria é ignorada de propósito, senão o "melhor
  // match" seria sempre o combo exato e o fallback nunca aconteceria.
  const otherNames = dimensionNames.filter((name) => name !== dimensionName)

  let best: T | undefined
  let bestScore = -1
  let bestInStock = false

  for (const variant of variants) {
    const variations = readVariantVariations(variant, dimensionNames)

    if (slugifyVariant(variations[dimensionName] ?? '') !== targetValue) {
      continue
    }

    const score = otherNames.reduce(
      (total, name) =>
        slugifyVariant(variations[name] ?? '') ===
        slugifyVariant(preferredVariations[name] ?? '')
          ? total + 1
          : total,
      0
    )
    const inStock = isVariantInStock(variant)

    // `>` e não `>=` mantém a estabilidade: o primeiro SKU de cada pontuação
    // vence. A exceção é estoque — um SKU igualmente próximo E disponível
    // substitui um esgotado.
    if (score > bestScore || (score === bestScore && inStock && !bestInStock)) {
      best = variant
      bestScore = score
      bestInStock = inStock
    }
  }

  return best
}

/**
 * Resolve o slug de um SKU que tenha determinado valor numa dimensão, ignorando
 * as demais — a primeira chave que casar vence.
 *
 * É uma resolução frouxa: serve para contextos que não conhecem o combo completo
 * (ex.: o seletor do minicart, que tem só o item). Quando as outras dimensões
 * são conhecidas, prefira `resolveSlugForVariations`, que preserva a seleção.
 */
export function resolveSlugForVariantValue(
  slugsMap: Record<string, string>,
  dimensionName: string,
  value: string
): string | undefined {
  const targetName = slugifyVariant(dimensionName)
  const targetValue = slugifyVariant(value)
  // Ancora "Nome-Valor" e aceita tanto o fim da chave quanto a continuação para
  // a próxima dimensão. Com uma âncora só não é possível saber onde o valor
  // termina (as outras dimensões são desconhecidas aqui), então o casamento é
  // por prefixo: o par procurado tem que aparecer inteiro na chave.
  const anchor = new RegExp(
    `(^|-)${escapeRegExp(dimensionName)}-${escapeRegExp(value)}(-|$)`,
    'i'
  )

  for (const [key, slug] of Object.entries(slugsMap)) {
    if (anchor.test(key)) {
      return slug
    }

    // Comparação normalizada, para tolerar acento/caixa/espaço divergentes
    // entre o valor recebido e o que a API gravou na chave.
    const normalizedKey = slugifyVariant(key)
    const normalizedPair = `${targetName}-${targetValue}`

    if (
      normalizedKey === normalizedPair ||
      normalizedKey.startsWith(`${normalizedPair}-`) ||
      normalizedKey.endsWith(`-${normalizedPair}`) ||
      normalizedKey.includes(`-${normalizedPair}-`)
    ) {
      return slug
    }
  }

  return undefined
}
