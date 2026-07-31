# extend-graphql

Estende a FastStore API adicionando **campos customizados a uma query nativa** (via typeDef + resolver + fragment) e mostra **como consumir** esse dado num componente. Segue os padrões do projeto (ver `CLAUDE.md`) e as docs em `.claude/docs/` (`extending-queries.md`, `using-fragments.md`, `consuming-queries.md`, `best-practices-graphql.md`).

## Uso

```
/extend-graphql <TipoOuQuery> <campo> [--consume=pdp|plp|search|page|client]
```

**Exemplos:**

- `/extend-graphql StoreProduct customData --consume=pdp`
- `/extend-graphql StoreProduct isVegan --consume=plp`

Se o tipo/query ou o modo de consumo não forem informados, pergunte ao usuário.

---

## Quando usar

Use quando um componente precisa de um dado que **não existe no schema nativo** do FastStore — um campo extra vindo de uma API VTEX que a FastStore API não expõe por padrão.

**Chamado pelo `/new-component`:** quando o componente sendo criado depende de um campo fora do schema nativo, rode esta skill para criar a extensão antes (ou logo depois) de montar o componente, e conecte o consumo no `.tsx`/hook.

> **Fora de escopo aqui:** criar uma query/tipo totalmente novo a partir de uma API de terceiros (`src/graphql/thirdParty`). O fluxo é análogo (typeDefs + resolvers com um `type Query { ... }` próprio), mas esta skill foca em **estender uma query nativa via fragment**. Ver `.claude/docs/extending-queries.md` (seção "third-party") se precisar.

---

## O fluxo em 4 passos

```
1. typeDef   →  src/graphql/vtex/typeDefs/<tipo>.graphql   (extend type ... { campo })
2. resolver  →  src/graphql/vtex/resolvers/<tipo>.ts + index.ts
3. fragment  →  src/fragments/<QueryNativa>.ts             (injeta o campo na query da página)
4. consumir  →  no componente: usePDP()/usePLP()/... ou useQuery_unstable / hook específico
```

Os passos 1–2 **declaram** o campo no schema. O passo 3 faz a página **pedir** o campo (sem ele, o resolver existe mas ninguém consome). O passo 4 **lê** o dado no componente.

---

## Passo 1 — typeDef (`src/graphql/vtex/typeDefs/<tipo>.graphql`)

Estruturas de pastas obrigatórias: `src/graphql/vtex/typeDefs/` e `src/graphql/vtex/resolvers/`. Um `.graphql` por tipo (organização interna livre; todos os `.graphql` da pasta são considerados).

```graphql
# src/graphql/vtex/typeDefs/product.graphql
extend type StoreProduct {
  """
  Descrição do campo customizado (aparece no schema).
  """
  customData: String!
}
```

> O nome do arquivo é livre, mas convencione pelo tipo estendido (`product.graphql` para `StoreProduct`). A extensão **precisa** ser `.graphql`.

---

## Passo 2 — resolver (`src/graphql/vtex/resolvers/<tipo>.ts` + `index.ts`)

O resolver diz **como** o campo é preenchido, a partir do root object do tipo (ex.: `StoreProductRoot`).

```ts
// src/graphql/vtex/resolvers/product.ts
import type { StoreProductRoot } from '@faststore/api'

const productResolver = {
  StoreProduct: {
    customData: (root: StoreProductRoot) => {
      return 'My item id: ' + root.itemId
    },
  },
}

export default productResolver
```

O `index.ts` (obrigatório na pasta `resolvers`) combina todos os resolvers num objeto só:

```ts
// src/graphql/vtex/resolvers/index.ts
import { default as StoreProductResolver } from './product'

const resolvers = {
  ...StoreProductResolver,
}

export default resolvers
```

> Tipar o `root` (ex.: `StoreProductRoot` de `@faststore/api`) dá autocomplete dos campos disponíveis no root. Ver root object fields na doc da VTEX.

---

## Passo 3 — fragment (`src/fragments/<QueryNativa>.ts`)

> Para os detalhes de fragment (convenção de nome, enxugar payload, gotchas de merge aditivo), use a skill **`/create-fragment`** — o resumo abaixo é o suficiente para o fluxo de extensão.

O fragment é o que faz a query da página **pedir** o campo novo. A FastStore associa automaticamente os fragments em `src/fragments/` às queries nativas — **não precisa importar o fragment em lugar nenhum**, a associação é por convenção de nome.

> ⚠️ **O nome do arquivo e do fragment tem que ser exatamente o nome da query nativa** que você quer estender (ver tabela abaixo). `ServerProduct.ts` → `fragment ServerProduct on Query`.

```ts
// src/fragments/ServerProduct.ts
import { gql } from '@faststore/core/api'

export const fragment = gql(`
  fragment ServerProduct on Query {
    product(locator: $locator) {
      customData
    }
  }
`)
```

> **`gql` vem de `@faststore/core/api`** e é chamado como **função** (`gql(\`...\`)`, com parênteses). Não use `@faststore/graphql-utils` (forma antiga/deprecada).

### Queries nativas estendíveis (nome do fragment = nome do arquivo)

| Fragment / arquivo           | Side   | Query      | Página                    | Consome com                                  |
| ---------------------------- | ------ | ---------- | ------------------------- | -------------------------------------------- |
| `ServerProduct`              | Server | product    | PDP                       | `usePDP()`                                   |
| `ClientProduct`              | Client | product    | PDP                       | `usePDP()`                                   |
| `ServerCollectionPage`       | Server | collection | PLP                       | `usePLP()`                                   |
| `ClientProductGallery`       | Client | search     | PLP / Search              | `usePLP()` / `useSearchPage()` / `usePage()` |
| `ClientManyProducts`         | Client | search     | Shelf, Tiles, PLP, Search | `usePage()` / `useProductsQuery`             |
| `ClientShippingSimulation`   | Client | shipping   | PDP                       | `useShippingSimulation_unstable()`           |
| `ClientSearchSuggestions`    | Client | search     | SearchInput               | `useSuggestions_unstable()`                  |
| `ClientTopSearchSuggestions` | Client | search     | SearchInput               | `useTopSearch_unstable()`                    |

> Na PDP, `ServerProduct` traz o dado inicial (server, `getStaticProps`) e `ClientProduct` atualiza no client. Se estender só um lado, o campo pode faltar no outro — estenda os dois se o dado precisa existir server **e** client.

---

## Passo 4 — consumir no componente

### a) Seção montada numa página (section do CMS) — hooks de contexto

Os componentes deste projeto entram no CMS como sections. Numa página específica, use o hook de contexto e leia o campo novo:

```tsx
import { usePDP } from '@faststore/core'

function MinhaSection() {
  const context = usePDP()
  return <span>{context?.data?.product?.customData}</span>
}
```

Hooks disponíveis (de `@faststore/core`): `usePDP()`, `usePLP()`, `useSearchPage()`, `usePage()`. Quando a mesma section roda em mais de um tipo de página, use `usePage()` com generics e os type guards:

```tsx
import { usePage, isPDP, isPLP } from '@faststore/core'
import type { PDPContext, PLPContext } from '@faststore/core'

const context = usePage<PDPContext | PLPContext>()
if (isPDP(context)) {
  // context.data.product...
}
```

### b) Fora de contexto de página / busca client-side — hooks experimentais

Para dado que não vem do contexto de página (ex.: busca num drawer), use os hooks experimentais de `@faststore/core/experimental`:

```tsx
import { useSuggestions_unstable as useSuggestions } from '@faststore/core/experimental'

const { data } = useSuggestions(term)
// data.search.suggestions.terms / .products (+ campos que você estendeu via ClientSearchSuggestions)
```

Ou uma query/mutation custom sua, via `useQuery_unstable`:

```tsx
import { gql } from '@faststore/core/api'
import { useQuery_unstable as useQuery } from '@faststore/core/experimental'

const query = gql(`
  query MyCustomQuery {
    customQuery { data }
  }
`)

function CustomComponent() {
  const result = useQuery(query, variables)
}
```

> ⚠️ **Path e disponibilidade:** importe de **`@faststore/core/experimental`** (não `@faststore/core/src/experimental`, que aparece errado numa das docs). O que existe é o que estiver em `.faststore/src/experimental/index.ts` — **confira lá antes de importar**. Nesta versão existem, por ex., `useQuery_unstable` e `useSuggestions_unstable`; `useClientManyProducts_unstable` (citado na doc `best-practices-graphql.md`) **não** está exportado — use `useProductsQuery` de `@faststore/core` para produtos.

---

## Regras e gotchas do projeto

- **Codegen só roda em `yarn dev`/`yarn build`.** As mudanças de schema (typeDef/resolver) e os fragments só entram nos tipos `@generated` e no schema efetivo quando o servidor de dev roda. Como neste projeto **não subimos servidor** (o usuário valida sozinho — ver `CLAUDE.md`), avise: _o usuário precisa rodar `yarn dev` uma vez para o codegen pegar os campos/fragments novos_. Até lá, `npx tsc --noEmit` pode não reconhecer o campo novo (não é erro real do código).
- **Não fazer overfetch.** Peça no fragment só os campos que o componente usa.
- **`gql` como função**, de `@faststore/core/api`.
- **Nome do fragment = nome exato da query nativa** (tabela acima), senão a associação não acontece.
- `src/graphql/vtex/{typeDefs,resolvers}` e o `resolvers/index.ts` são obrigatórios; a organização dos arquivos dentro deles é livre.

---

## Verificação

- `npx tsc --noEmit -p tsconfig.json` (lembrando do caveat de codegen acima — campo novo pode só resolver após `yarn dev`).
- **Nunca** subir servidor para validar — o usuário faz isso.

---

## Checklist final

- [ ] `src/graphql/vtex/typeDefs/<tipo>.graphql` com `extend type` e o campo documentado
- [ ] `src/graphql/vtex/resolvers/<tipo>.ts` com o resolver do campo, tipando o root
- [ ] `src/graphql/vtex/resolvers/index.ts` espalhando o resolver
- [ ] `src/fragments/<QueryNativa>.ts` com o nome = query nativa e só os campos usados
- [ ] `gql` importado de `@faststore/core/api` e chamado como função
- [ ] Consumo conectado no componente (hook de contexto ou experimental correto)
- [ ] Avisado o usuário sobre rodar `yarn dev` para o codegen
- [ ] Sem overfetch; sem `any` desnecessário

```

```
