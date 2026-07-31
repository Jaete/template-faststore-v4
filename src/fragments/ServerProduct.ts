import { gql } from '@generated'

/**
 * Fragment customizado do produto no servidor. Adiciona à seleção da PDP:
 *
 * 1. `availableInstallments` — resolver customizado em
 *    `src/graphql/vtex/resolvers/product.ts`.
 * 2. `allVariantProducts` — TODOS os SKUs do grupo, espelhando exatamente o
 *    `ClientProduct`.
 *
 * O espelhamento do item 2 é obrigatório, não estético: o `p.tsx` do core passa o
 * produto do servidor como `fallbackData` de
 * `useProductQuery<T extends ClientProductQueryQuery>`, o que exige que o tipo do
 * servidor seja assignável ao do cliente. Pedir os variantes só no cliente quebra
 * o `yarn build` com "Type ... is not assignable" em
 * `isVariantOf.skuVariants.allVariantProducts`.
 *
 * O custo é pequeno e limitado: ~1–3 KB gzip a mais no `__NEXT_DATA__` para um
 * produto típico (5–15 SKUs), e ZERO request/trabalho extra no backend — o
 * resolver de `allVariantProducts` é `root.isVariantOf.items.map(...)`, dados já
 * em memória do product search que resolveu o produto ativo. Em troca, os
 * variantes existem já no primeiro render.
 *
 * `description` fica de fora de propósito, igual ao `ClientProduct`: a API resolve
 * `description: isVariantOf.description`, ou seja é a MESMA string em todos os
 * SKUs — pedi-la N vezes é só payload.
 *
 * `specificationGroups` também resolve do `isVariantOf`, espelhando o
 * `ClientProduct` pelo mesmo motivo do `allVariantProducts`.
 *
 * `skuDimensions` — resolver customizado em
 * `src/graphql/vtex/resolvers/skuDimensions.ts`, espelhando o
 * `ClientProduct` (raiz + `allVariantProducts`) pelo mesmo motivo.
 */
export const fragment = gql(`
  fragment ServerProduct on Query {
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
