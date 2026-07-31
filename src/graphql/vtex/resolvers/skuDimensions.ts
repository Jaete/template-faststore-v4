/**
 * Resolver que expõe as dimensões físicas do SKU (`skuDimensions`) no
 * `StoreProduct`. Nem o Intelligent Search nem o endpoint público de busca
 * de catálogo trazem esse dado de forma confiável — só o endpoint privado
 * `pvt/sku/stockkeepingunitbyid/{skuId}` da Catalog API retorna
 * `Dimension`/`RealDimension`, e ele exige autenticação de aplicação
 * (`X-VTEX-API-AppKey`/`AppToken`, geradas no admin da conta).
 *
 * `allVariantProducts` resolve `skuDimensions` para CADA SKU do grupo — o
 * cache por `itemId` colapsa chamadas repetidas para o MESMO SKU dentro do
 * mesmo processo (útil sobretudo em dev, com fast refresh reexecutando
 * resolvers).
 */

import storeConfig from '../../../../discovery.config'

interface VtexDimension {
  height: number
  length: number
  width: number
  weight: number
  cubicweight: number
}

interface VtexRealDimension {
  realHeight: number
  realLength: number
  realWidth: number
  realWeight: number
  realCubicWeight: number
}

interface VtexSkuById {
  Id: number
  Dimension?: VtexDimension
  RealDimension?: VtexRealDimension
}

interface SkuMeasurements {
  height: number | null
  width: number | null
  length: number | null
  weight: number | null
  cubicWeight: number | null
}

interface StoreProductRoot {
  itemId?: string
}

/** `0` na Catalog API sempre significa "não cadastrado", nunca uma medida real. */
function toMeasurementOrNull(value?: number): number | null {
  return value && value > 0 ? value : null
}

function hasAnyMeasurement(measurements: SkuMeasurements): boolean {
  return Object.values(measurements).some((value) => value !== null)
}

const skuCache = new Map<
  string,
  { expiresAt: number; promise: Promise<VtexSkuById | null> }
>()

const CACHE_TTL_MS = 60_000

function fetchSkuById(itemId: string): Promise<VtexSkuById | null> {
  const cached = skuCache.get(itemId)

  if (cached && cached.expiresAt > Date.now()) {
    return cached.promise
  }

  const appKey = process.env.VTEX_APP_KEY_SKU
  const appToken = process.env.VTEX_APP_TOKEN_SKU

  if (!appKey || !appToken) {
    return Promise.resolve(null)
  }

  const base = `https://${storeConfig.api.storeId}.${storeConfig.api.environment}.com.br`
  const url = `${base}/api/catalog_system/pvt/sku/stockkeepingunitbyid/${itemId}`

  const promise = fetch(url, {
    headers: {
      Accept: 'application/json',
      'X-VTEX-API-AppKey': appKey,
      'X-VTEX-API-AppToken': appToken,
    },
  })
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null)

  skuCache.set(itemId, { promise, expiresAt: Date.now() + CACHE_TTL_MS })

  return promise
}

const skuDimensionsResolver = {
  StoreProduct: {
    skuDimensions: async (root: StoreProductRoot) => {
      try {
        if (!root.itemId) {
          return null
        }

        const sku = await fetchSkuById(root.itemId)

        if (!sku) {
          return null
        }

        const withPackage: SkuMeasurements = {
          height: toMeasurementOrNull(sku.Dimension?.height),
          width: toMeasurementOrNull(sku.Dimension?.width),
          length: toMeasurementOrNull(sku.Dimension?.length),
          weight: toMeasurementOrNull(sku.Dimension?.weight),
          cubicWeight: toMeasurementOrNull(sku.Dimension?.cubicweight),
        }

        const withoutPackage: SkuMeasurements = {
          height: toMeasurementOrNull(sku.RealDimension?.realHeight),
          width: toMeasurementOrNull(sku.RealDimension?.realWidth),
          length: toMeasurementOrNull(sku.RealDimension?.realLength),
          weight: toMeasurementOrNull(sku.RealDimension?.realWeight),
          cubicWeight: toMeasurementOrNull(sku.RealDimension?.realCubicWeight),
        }

        if (
          !hasAnyMeasurement(withPackage) &&
          !hasAnyMeasurement(withoutPackage)
        ) {
          return null
        }

        return {
          withPackage: hasAnyMeasurement(withPackage) ? withPackage : null,
          withoutPackage: hasAnyMeasurement(withoutPackage)
            ? withoutPackage
            : null,
        }
      } catch {
        return null
      }
    },
  },
}

export default skuDimensionsResolver
