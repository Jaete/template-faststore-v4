import { gql } from '@generated'

/**
 * Fragment customizado do produto no cliente. Adiciona à seleção da PDP:
 *
 * 1. `availableInstallments` — resolver customizado em
 *    `src/graphql/vtex/resolvers/product.ts`.
 * 2. `allVariantProducts` — TODOS os SKUs do grupo, que alimentam a troca de
 *    variante no cliente (sem navegação) no `ActiveSkuProvider`.
 *
 * Por que aqui e não numa query própria: esta `ClientProductQuery` já dispara no
 * mount da PDP (`enableClientOffer` está desligado no `discovery.config.js`, então
 * `.faststore/src/pages/[slug]/p.tsx` usa o caminho do `useProductQuery`), e o
 * resultado é deepmerged no contexto do `usePDP`. Pedir os variantes aqui custa
 * ZERO request extra. No backend também é ~grátis: o resolver de
 * `allVariantProducts` é `root.isVariantOf.items.map(...)` — dados já em memória
 * do product search que resolveu o produto ativo.
 *
 * `availableInstallments` dentro de `allVariantProducts` funciona porque o typeDef
 * customizado é `extend type StoreProduct` e cada variante traz os próprios
 * `sellers` — é o que dá parcelamento correto por SKU sem N requests.
 *
 * O `ServerProduct` espelha este mesmo bloco `allVariantProducts` — e precisa
 * espelhar. O `p.tsx` do core passa o produto do servidor como `fallbackData` de
 * `useProductQuery<T extends ClientProductQueryQuery>`, então o tipo do servidor
 * tem que ser assignável ao do cliente; pedir os variantes só aqui quebra o
 * `yarn build`. Ver o comentário do `ServerProduct.ts` para o custo e o ganho.
 *
 * `description` fica de fora de propósito: a API resolve
 * `description: isVariantOf.description`, ou seja é a MESMA string em todos os
 * SKUs — pedi-la N vezes é só payload.
 *
 * `specificationGroups` também resolve do `isVariantOf` (atributos de
 * categoria do produto pai) — mesmo raciocínio do `description`, pedida uma
 * vez só no produto raiz.
 *
 * `skuDimensions` — resolver customizado em
 * `src/graphql/vtex/resolvers/skuDimensions.ts`. Varia por SKU (é medida
 * física de logística, não atributo do produto pai), por isso é pedido no
 * raiz e dentro de `allVariantProducts`, igual `skuAttachments`.
 */
export const fragment = gql(`
  fragment ClientProduct on Query {
    product(locator: $locator) {
      id: productID

      availableInstallments {
        installmentPaymentSystemName
        installmentValue
        installmentInterest
        installmentNumber
      }

      skuAttachments {
        attachmentID
        name
        required
        values {
          value
        }
      }

      skuDimensions {
        withPackage {
          height
          width
          length
          weight
          cubicWeight
        }
        withoutPackage {
          height
          width
          length
          weight
          cubicWeight
        }
      }

      specificationGroups {
        name
        originalName
        specifications {
          name
          originalName
          values
        }
      }

      crossSellingProducts {
        sku
        slug
        name
        image {
          url
          alternateName
        }
        offers {
          lowPrice
          offers {
            availability
            price
            listPrice
            quantity
            seller {
              identifier
            }
          }
        }
      }

      isVariantOf {
        skuVariants {
          allVariantProducts {
            sku
            slug
            name
            gtin
            image {
              url
              alternateName
            }
            offers {
              lowPrice
              offers {
                availability
                price
                listPrice
                quantity
                seller {
                  identifier
                }
              }
            }
            additionalProperty {
              propertyID
              name
              value
              valueReference
            }
            availableInstallments {
              installmentPaymentSystemName
              installmentValue
              installmentInterest
              installmentNumber
            }
            skuAttachments {
              attachmentID
              name
              required
              values {
                value
              }
            }
            skuDimensions {
              withPackage {
                height
                width
                length
                weight
                cubicWeight
              }
              withoutPackage {
                height
                width
                length
                weight
                cubicWeight
              }
            }
          }
        }
      }
    }
  }
`)
