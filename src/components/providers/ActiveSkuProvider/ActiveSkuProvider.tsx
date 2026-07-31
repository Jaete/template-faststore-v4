import type { PropsWithChildren } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

// IMPORTANTE: `usePDP` tem que vir deste módulo — nunca de `@faststore/core`.
// O `PageContext` é criado aqui; ler de outra cópia devolve outra instância de
// contexto e o produto vem `undefined`.
import { usePDP } from 'src/sdk/overrides/PageProvider'
import type { PDPVariantProduct } from '../../../types/faststore-custom'

import {
  findBestVariantForValue,
  isVariantInStock,
  readVariantVariations,
  slugifyVariant,
} from '../../../utils/skuVariants'
import type { ActiveSkuContextValue } from './ActiveSkuProvider.types'

const ActiveSkuContext = createContext<ActiveSkuContextValue | undefined>(
  undefined
)

/**
 * Chave canônica de um combo de variações. Ordenada e normalizada para que a
 * comparação não dependa da ordem das dimensões nem de acento/caixa/espaço —
 * `activeVariations` e as `additionalProperty` vêm de caminhos diferentes da API
 * e podem divergir na grafia.
 */
function comboKey(
  dimensionNames: string[],
  variations: Record<string, string>
) {
  return dimensionNames
    .map(
      (name) =>
        `${slugifyVariant(name)}:${slugifyVariant(variations[name] ?? '')}`
    )
    .sort()
    .join('|')
}

/**
 * Aponta a URL para o slug do SKU ativo, sem navegar.
 *
 * `history.replaceState` não passa pelo router do Next: nenhum re-render, nenhum
 * `getStaticProps`. Um `router.replace(shallow)` seria perigoso aqui — a PDP é
 * rota dinâmica `[slug]` e a página recebe `key: seo.canonical`, então revalidar
 * os props remontaria a PDP inteira e o SKU ativo/índice da galeria se perderiam.
 * Mesmo padrão que o core usa em `src/sdk/search/state.ts`.
 *
 * `replace` e não `push`: empilhar faria o botão "voltar" passear pelos SKUs.
 */
function syncUrlToSlug(slug: string) {
  if (typeof window === 'undefined') {
    return
  }

  // Preserva a querystring: o preço à vista depende de `utm_source`, então
  // descartá-la mudaria o preço num F5.
  const href = `/${slug}/p${window.location.search}`

  window.history.replaceState(
    // `as`/`url` são lidos pelo router do Next ao navegar/voltar; omitir
    // deixaria a próxima navegação client-side inconsistente.
    { ...window.history.state, as: href, url: href },
    '',
    href
  )
}

/**
 * Provider do SKU ativo da PDP.
 *
 * Troca de variante acontece INTEIRAMENTE no cliente: os dados de todos os SKUs
 * do grupo vêm em `allVariantProducts` (pedido pelo fragment
 * `src/fragments/ClientProduct.ts`, na query que a PDP já dispara no mount), e
 * escolher uma variação apenas troca qual deles é exibido. Nenhuma navegação,
 * nenhum SSR, nenhum loading.
 *
 * O matching SKU ↔ combo usa as `additionalProperty` de cada variante (as
 * `variations` da API) em vez de parsear o `slugsMap`: é a mesma fonte de que a
 * API construiu o mapa, e devolve o objeto do SKU num passo só.
 */
function ActiveSkuProvider({ children }: PropsWithChildren) {
  const context = usePDP()
  const ssrProduct = context?.data?.product
  const skuVariants = ssrProduct?.isVariantOf?.skuVariants
  // O codegen tipa `allVariantProducts` a partir do fragment base do core
  // (`{ name, productID }`), mas o fragment customizado `ClientProduct` pede a
  // seleção completa — daí a asserção para o shape que de fato chega em runtime.
  const variants = skuVariants?.allVariantProducts as unknown as
    PDPVariantProduct[] | null | undefined
  // Lidos em variáveis próprias para que as deps dos memos abaixo sejam os
  // valores em si, e não caminhos de propriedade de `skuVariants` — o React
  // Compiler infere a dependência no objeto inteiro e recusa a memoização
  // manual quando as duas não batem.
  const availableVariations = skuVariants?.availableVariations
  const ssrActiveVariations = skuVariants?.activeVariations

  /**
   * O estado guarda só o SKU (string), nunca o objeto do variante: assim, quando
   * o SWR revalidar (troca de sessão/login muda a chave de cache), os dados
   * exibidos acompanham automaticamente e a escolha do usuário não regride.
   */
  const [selectedSku, setSelectedSku] = useState<string | null>(null)
  /**
   * Combo pedido num clique que aconteceu antes de `allVariantProducts` chegar.
   * Serve para o chip acender na hora; o SKU é aplicado quando os dados chegam.
   */
  const [pendingVariations, setPendingVariations] = useState<Record<
    string,
    string
  > | null>(null)

  // Ordem estável das dimensões — base do `comboKey`.
  const dimensionNames = useMemo(
    () => Object.keys(availableVariations ?? {}),
    [availableVariations]
  )

  // Índice sku -> variante, para não varrer o array a cada render/clique.
  const variantsBySku = useMemo(() => {
    const map = new Map<string, PDPVariantProduct>()

    for (const variant of variants ?? []) {
      map.set(variant.sku, variant)
    }

    return map
  }, [variants])

  // Índice combo -> variante. A construção é O(N × dimensões) com
  // `slugifyVariant`, então memoizar importa de verdade aqui.
  const variantsByCombo = useMemo(() => {
    const map = new Map<string, PDPVariantProduct>()

    for (const variant of variants ?? []) {
      map.set(
        comboKey(
          dimensionNames,
          readVariantVariations(variant, dimensionNames)
        ),
        variant
      )
    }

    return map
  }, [variants, dimensionNames])

  const resolveVariant = useCallback(
    (variations: Record<string, string>) =>
      variantsByCombo.get(comboKey(dimensionNames, variations)),
    [variantsByCombo, dimensionNames]
  )

  /**
   * Produto exibido. O memo central: só muda quando o SKU escolhido ou os dados
   * realmente mudam, e é o que impede Gallery/Details de re-renderizarem sem
   * motivo.
   *
   * Se houver um clique pendente (variantes ainda não chegaram), tenta resolvê-lo
   * agora — é assim que a escolha feita "cedo demais" se aplica sozinha quando os
   * dados chegam, sem efeito nem timer.
   *
   * O fallback para `ssrProduct` cobre dois casos: variantes ainda não chegaram, e
   * o SKU escolhido desaparecer numa revalidação.
   */
  /**
   * SKU do combo pendente, quando ele já pode ser resolvido. É assim que um
   * clique feito antes de os variantes chegarem se aplica sozinho, sem efeito
   * nem timer.
   */
  const pendingVariant = useMemo(
    () =>
      pendingVariations
        ? variantsByCombo.get(comboKey(dimensionNames, pendingVariations))
        : undefined,
    [pendingVariations, variantsByCombo, dimensionNames]
  )

  const product = useMemo(
    () =>
      pendingVariant ??
      (selectedSku ? variantsBySku.get(selectedSku) : undefined) ??
      // O produto do SSR tem a mesma superfície do variante, exceto `slug`
      // (a ServerProductQuery não o pede). Só é usado para exibição — quem
      // precisa de `slug` é a URL, e aí já existe um variante resolvido.
      (ssrProduct as unknown as PDPVariantProduct),
    [pendingVariant, selectedSku, variantsBySku, ssrProduct]
  )

  /**
   * Variações exibidas.
   *
   * O combo pendente só tem prioridade ENQUANTO não resolve num SKU — é o que
   * faz o chip clicado acender na hora. Assim que o variante correspondente
   * chega, as variações passam a ser lidas do produto de verdade; sem essa
   * condição o pending ficaria grudado e o clique seguinte partiria de um estado
   * obsoleto.
   */
  const activeVariations = useMemo(() => {
    if (pendingVariations && !pendingVariant) {
      return pendingVariations
    }

    // Sem variantes ainda: as variações do SKU do SSR já vêm prontas da API.
    if (!variants && ssrActiveVariations) {
      return ssrActiveVariations
    }

    return readVariantVariations(product, dimensionNames)
  }, [
    pendingVariations,
    pendingVariant,
    variants,
    ssrActiveVariations,
    product,
    dimensionNames,
  ])

  const selectVariation = useCallback(
    (dimensionName: string, value: string) => {
      const desired = { ...activeVariations, [dimensionName]: value }

      // 1º: o combo exato — preserva integralmente a seleção das outras
      // dimensões, que é o comportamento esperado na esmagadora maioria dos
      // cliques.
      const target =
        resolveVariant(desired) ??
        // 2º: o combo não existe no catálogo. Em vez de ignorar o clique,
        // reajusta as outras dimensões para o SKU mais próximo que TEM o valor
        // clicado — é o que impede que um valor fique inalcançável só por causa
        // da ordem em que o usuário clicou (ver `findBestVariantForValue`).
        (variants
          ? findBestVariantForValue(
              variants,
              dimensionNames,
              activeVariations,
              dimensionName,
              value
            )
          : undefined)

      if (!target) {
        // Variantes ainda não chegaram: registra a intenção. O `product` acima
        // resolve sozinho quando os dados aparecerem.
        if (!variants) {
          setPendingVariations(desired)
        }

        return
      }

      if (target.sku === product?.sku) {
        return
      }

      setPendingVariations(null)
      setSelectedSku(target.sku)
      syncUrlToSlug(target.slug)
    },
    [activeVariations, resolveVariant, variants, dimensionNames, product?.sku]
  )

  /**
   * Sincroniza a URL quando um clique feito antes dos variantes chegarem é
   * aplicado. O caminho normal escreve a URL no próprio handler; este efeito só
   * cobre a resolução tardia, em que não havia `slug` na hora do clique.
   *
   * O efeito NÃO promove o pending para `selectedSku`: seria um setState síncrono
   * dentro de efeito (render em cascata) e é redundante — `product` já prefere
   * `pendingVariant`, e `activeVariations` já para de priorizar o pending assim
   * que ele resolve. O próximo clique sobrescreve os dois estados de uma vez.
   */
  useEffect(() => {
    if (pendingVariant) {
      syncUrlToSlug(pendingVariant.slug)
    }
  }, [pendingVariant])

  /**
   * Estoque do SKU exibido — o que decide entre o bloco de compra e o
   * "Avise-me" no `Details`.
   *
   * Enquanto os variantes não chegaram, `product` é o do SSR, que descreve o SKU
   * canônico: já é a resposta certa para o primeiro render, sem janela em que a
   * coluna piscaria de um bloco para o outro.
   */
  const isAvailable = useMemo(() => isVariantInStock(product), [product])

  // Seleção de anexos (attachments) do SKU exibido. Fica aqui, e não no
  // seletor, porque o `BuyBlock` (irmão na árvore) também precisa lê-la para
  // montar o item do carrinho.
  const [attachmentSelection, setAttachmentSelection] = useState<
    Record<string, string>
  >({})

  const activeSku = product?.sku ?? ''

  // Revalida a seleção quando o SKU muda, ajustando durante a renderização em
  // vez de `useEffect` — evita o setState em cascata. Um anexo só é mantido se
  // o SKU novo o oferecer com o mesmo valor; do contrário some do estado (e o
  // seletor correspondente volta a exibir "selecione").
  const [lastSkuForAttachments, setLastSkuForAttachments] = useState(activeSku)

  if (activeSku !== lastSkuForAttachments) {
    setLastSkuForAttachments(activeSku)
    setAttachmentSelection((current) => {
      const skuAttachments = product?.skuAttachments ?? []
      const next: Record<string, string> = {}

      for (const attachment of skuAttachments) {
        const selectedValue = current[attachment.name]
        const stillValid = attachment.values.some(
          ({ value }) => value === selectedValue
        )

        if (stillValid) {
          next[attachment.name] = selectedValue
        }
      }

      return next
    })
  }

  const setAttachmentValue = useCallback(
    (attachmentName: string, value: string) => {
      setAttachmentSelection((current) => ({
        ...current,
        [attachmentName]: value,
      }))
    },
    []
  )

  const value = useMemo<ActiveSkuContextValue>(
    () => ({
      product,
      activeSku,
      activeVariations,
      isAvailable,
      selectVariation,
      resolveVariant,
      isVariantsPending: !variants,
      attachmentSelection,
      setAttachmentValue,
    }),
    [
      product,
      activeSku,
      activeVariations,
      isAvailable,
      selectVariation,
      resolveVariant,
      variants,
      attachmentSelection,
      setAttachmentValue,
    ]
  )

  return (
    <ActiveSkuContext.Provider value={value}>
      {children}
    </ActiveSkuContext.Provider>
  )
}

/**
 * Acessa o SKU ativo da PDP. Precisa estar sob um `ActiveSkuProvider` — que é
 * montado pela section `ProductInfo`.
 */
export function useActiveSku() {
  const context = useContext(ActiveSkuContext)

  if (!context) {
    throw new Error('useActiveSku precisa estar dentro de ActiveSkuProvider')
  }

  return context
}

export default ActiveSkuProvider
