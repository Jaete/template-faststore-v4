/**
 * Resolver de `crossSellingProducts` — os produtos relacionados cadastrados em
 * **Catálogo → Relacionamento entre produtos** no admin da VTEX.
 *
 * A origem é a API pública de crossselling da Catalog:
 * `GET /api/catalog_system/pub/products/crossselling/{relationType}/{productId}`
 * (sem autenticação). O tipo de relação é configurável pela env
 * `VTEX_CROSS_SELLING_RELATION_TYPE` — `showtogether` (compre junto) por
 * padrão, mas `similars`, `accessories`, `whosawalsosaw`, `whosawalsobought` e
 * `whoboughtalsobought` também são válidos.
 *
 * O endpoint devolve produtos no formato da Catalog legada, que NÃO é o
 * `ProductSearchResult` do Intelligent Search que os resolvers do core esperam
 * (preço e disponibilidade ficam em `items[].sellers[].commertialOffer`). Por
 * isso usamos o endpoint só como fonte dos productIds e hidratamos os produtos
 * pelo Intelligent Search — assim preço, estoque e imagem seguem exatamente o
 * mesmo caminho do resto da loja.
 *
 * São **productIds**, não skuIds — daí o `field: 'id'` no
 * `productsByIdentifier` (`'sku'` buscaria por itemId e não acharia nada).
 *
 * Por que não delegar para o `Query.products` do core: ele filtra o resultado
 * com `productIds.includes(sku.itemId)`, ou seja compara os ids recebidos com
 * o **itemId** de cada SKU. Como aqui os ids são de produto, esse filtro
 * descartaria todos os produtos.
 */

import type { ProductSearchResult } from '@faststore/api'

import storeConfig from '../../../../discovery.config'

/**
 * Produto do Intelligent Search. O `@faststore/api` não exporta o tipo
 * `Product` diretamente, só o `ProductSearchResult` que o contém.
 */
type SearchProduct = ProductSearchResult['products'][number]

/** Tipo de relação consultado na API de crossselling. */
const RELATION_TYPE =
  process.env.VTEX_CROSS_SELLING_RELATION_TYPE || 'showtogether'

/**
 * Teto de produtos resolvidos. A section exibe só 2 slots relacionados (mais
 * o produto atual) por vez, mas cada slot pode ciclar entre os relacionados
 * não exibidos no momento — por isso o teto aqui é o pool inteiro que a
 * troca de produto pode usar, não o que aparece de uma vez na tela. O endpoint
 * não pagina e pode devolver listas longas, então truncamos para não gerar uma
 * busca por id para cada.
 */
const MAX_CROSS_SELLING_PRODUCTS = 8

/** Produto como vem da API legada de catálogo — só o id nos interessa. */
interface CrossSellingProduct {
  productId?: string | number
}

interface StoreProductRoot {
  itemId?: string
  isVariantOf?: {
    productId?: string
  }
}

/** Ids relacionados, na ordem da API, sem duplicatas nem o próprio produto. */
async function fetchCrossSellingIds(productId: string): Promise<string[]> {
  const base = `https://${storeConfig.api.storeId}.${storeConfig.api.environment}.com.br`
  const url = `${base}/api/catalog_system/pub/products/crossselling/${RELATION_TYPE}/${productId}`

  const response = await fetch(url, {
    headers: { accept: 'application/json' },
  })

  if (!response.ok) {
    return []
  }

  const products = (await response.json()) as CrossSellingProduct[]

  return Array.from(
    new Set(
      (Array.isArray(products) ? products : [])
        .map((product) => String(product?.productId ?? '').trim())
        .filter((id) => /^\d+$/.test(id) && id !== productId)
    )
  ).slice(0, MAX_CROSS_SELLING_PRODUCTS)
}

/**
 * A busca por id devolve o produto com todos os seus SKUs. O root do
 * `StoreProduct` é um SKU "enriquecido" com o produto pai em `isVariantOf`,
 * que é a forma que os resolvers do core esperam.
 */
function toStoreProductRoot(product: SearchProduct) {
  const sku = product.items.find((item) => item.sellers?.length > 0)

  return sku ? { ...sku, isVariantOf: product } : null
}

const crossSellingResolver = {
  StoreProduct: {
    crossSellingProducts: async (
      root: StoreProductRoot,
      _: unknown,
      ctx: {
        clients: {
          search: {
            productsByIdentifier: (args: {
              field: 'id' | 'slug' | 'sku'
              values: string[]
            }) => Promise<SearchProduct[]>
          }
        }
      }
    ) => {
      try {
        const currentProductId = root.isVariantOf?.productId

        if (!currentProductId) {
          return []
        }

        const productIds = await fetchCrossSellingIds(String(currentProductId))

        if (!productIds.length) {
          return []
        }

        const products = await ctx.clients.search.productsByIdentifier({
          field: 'id',
          values: productIds,
        })

        const byProductId = new Map(
          products.map((product) => [String(product.productId), product])
        )

        // Reordena pelo cadastro: `productsByIdentifier` resolve os ids em
        // paralelo e não garante a ordem de entrada.
        return productIds
          .map((productId) => byProductId.get(productId))
          .filter((product): product is SearchProduct => Boolean(product))
          .map(toStoreProductRoot)
          .filter(Boolean)
      } catch {
        return []
      }
    },
  },
}

export default crossSellingResolver
