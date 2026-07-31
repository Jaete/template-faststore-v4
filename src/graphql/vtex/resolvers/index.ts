import { default as CouponResolver } from './coupon'
import { default as ProductResolver } from './product'
import { default as ContactResolver } from './contact'
import { default as SkuDimensionsResolver } from './skuDimensions'
import { default as CrossSellingResolver } from './crossSelling'

// Merge raso: resolvers que compartilham a mesma chave de tipo (aqui,
// `StoreProduct` em `ProductResolver`, `SkuDimensionsResolver` e
// `CrossSellingResolver`) precisam mesclar os campos manualmente — um spread
// no nível de cima faria o último objeto sobrescrever o `StoreProduct` inteiro
// do anterior, apagando `availableInstallments`/`skuAttachments`.
const resolvers = {
  ...CouponResolver,
  ...ContactResolver,
  StoreProduct: {
    ...ProductResolver.StoreProduct,
    ...SkuDimensionsResolver.StoreProduct,
    ...CrossSellingResolver.StoreProduct,
  },
}

export default resolvers
