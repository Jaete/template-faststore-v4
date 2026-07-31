<<<<<<< HEAD

# create-fragment

Cria (ou sobrescreve) um **GraphQL fragment** de uma query nativa da FastStore em `src/fragments/`, com uma regra de ouro: **trazer só os campos que o componente realmente usa**. Fragment é o lever para moldar o payload das queries de página/busca — tanto para _adicionar_ campos quanto para manter a query enxuta.

Baseado em `.claude/docs/using-fragments.md` e `best-practices-graphql.md`. Relacionada a **`/extend-graphql`** (ver "Quando usar").

## Uso

```
/create-fragment <QueryNativa> [campos...]
```

**Exemplos:**

- `/create-fragment ClientSearchSuggestions` → busca traz só o termo sugerido
- `/create-fragment ClientProduct id name` → PDP client traz só o necessário

Se a query nativa não for informada, pergunte ao usuário (ver tabela abaixo).

---

## Quando usar

- **Use esta skill** quando o campo **já existe** no schema nativo e você só quer controlar **o que a query traz** — seja para enxugar (não trazer o que não usa) ou para incluir um campo nativo que ainda não está no fragment.
- **Use `/extend-graphql`** quando o campo **não existe** no schema (precisa de `typeDef` + `resolver` antes do fragment). Depois de declarado, o passo do fragment é exatamente o desta skill.

> Regra do projeto: **sempre enxugar a GraphQL** — trazer só os dados necessários. Overfetch em página custa performance (ver `best-practices` nas docs).

---

## Como funciona

O core já traz fragments-padrão em `.faststore/src/customizations/src/fragments/` (gerenciados pelo CLI — **não editar**). Um arquivo seu em **`src/fragments/<QueryNativa>.ts`** com o **mesmo nome** sobrescreve o default por convenção — a FastStore associa o fragment à query da página automaticamente, **sem import manual em lugar nenhum**.

> ⚠️ **O nome do arquivo e do fragment tem que ser exatamente o nome da query nativa** (tabela abaixo). `ClientSearchSuggestions.ts` → `fragment ClientSearchSuggestions on Query`.

### Queries nativas estendíveis

| Fragment / arquivo           | Side   | Query      | Página / uso               | Consome com                        |
| ---------------------------- | ------ | ---------- | -------------------------- | ---------------------------------- |
| `ServerProduct`              | Server | product    | PDP (`getStaticProps`)     | `usePDP()`                         |
| `ClientProduct`              | Client | product    | PDP (`useProductQuery`)    | `usePDP()`                         |
| `ServerCollectionPage`       | Server | collection | PLP (`getStaticProps`)     | `usePLP()`                         |
| `ClientProductGallery`       | Client | search     | PLP / Search               | `usePLP()` / `useSearchPage()`     |
| `ClientManyProducts`         | Client | search     | Shelf, Tiles, PLP, Search  | `usePage()` / `useProductsQuery`   |
| `ClientShippingSimulation`   | Client | shipping   | PDP                        | `useShippingSimulation_unstable()` |
| `ClientSearchSuggestions`    | Client | search     | SearchInput / busca        | `useSuggestions_unstable()`        |
| `ClientTopSearchSuggestions` | Client | search     | SearchInput (top searches) | `useTopSearch_unstable()`          |

---

## Passos

### 1. Identificar a query e o default atual

Veja o que o default já traz para não duplicar nem trazer a mais:

```bash
cat .faststore/src/customizations/src/fragments/<QueryNativa>.ts
```

### 2. Criar `src/fragments/<QueryNativa>.ts`

```ts
// src/fragments/ClientSearchSuggestions.ts
import { gql } from '@faststore/core/api'

export const fragment = gql(`
  fragment ClientSearchSuggestions on Query {
    search(first: 5, term: $term, selectedFacets: $selectedFacets) {
      suggestions {
        terms {
          value
        }
      }
    }
  }
`)
```

> **`gql` de `@faststore/core/api`**, chamado como **função** (`gql(\`...\`)`). Não use `@faststore/graphql-utils`(deprecado). Os arquivos do core usam`@generated`internamente — no **nosso**`src/fragments/`é`@faststore/core/api`.

### 3. Selecionar só o necessário

Peça apenas os campos que o componente/hook consome. No exemplo da busca, para uma lista de sugestões de texto, basta `suggestions.terms.value` (o termo sugerido) — nada de trazer cards de produto, `metadata`, etc. se a UI não usa.

---

## Exemplo: busca trazendo só o termo sugerido

O hook nativo `useSuggestions_unstable` roda a query `ClientSearchSuggestionsQuery`, que espalha o fragment `ClientSearchSuggestions`. Mantendo o fragment com só `terms { value }`, a lista de autocomplete recebe apenas o texto da sugestão — que é o dado necessário para o highlight do termo digitado.

```ts
// consumo (ex.: em use<Componente>.ts)
import { useSuggestions_unstable as useSuggestions } from '@faststore/core/experimental'

const { data } = useSuggestions(term)
const terms = data?.search?.suggestions?.terms ?? [] // [{ value }]
```

---

## Gotchas

- **Merge aditivo.** O fragment é mesclado na query base — ele molda o trecho que declara (ex.: `search { suggestions { ... } }`), mas **não remove** campos que o **hook do core** já pede fora do fragment. No `useSuggestions`, por exemplo, a query base também traz `suggestions.products { ...ProductSummary_product }`, `products.pageInfo.totalCount`, `metadata` e `searchId` — isso **não some** só mexendo no nosso fragment.
- **Fragments compartilhados têm efeito global.** Trimar algo como `ProductSummary_product` (usado por shelves, tiles, busca) afeta **todos** os consumidores. Só faça se for intencional e valide os outros usos.
- **Codegen só roda em `yarn dev`/`yarn build`.** O fragment novo só entra nos tipos `@generated` depois disso. Como aqui **não subimos servidor** (o usuário valida — ver `CLAUDE.md`), **avise o usuário para rodar `yarn dev` uma vez**; até lá `npx tsc --noEmit` pode não refletir a mudança (não é erro real).
- **Não editar** os fragments em `.faststore/` — sobrescreva criando em `src/fragments/` com o mesmo nome.

---

## Verificação

- `npx tsc --noEmit -p tsconfig.json` (com o caveat de codegen acima).
- **Nunca** subir servidor para validar — o usuário faz isso.

---

## Checklist final

- [ ] Arquivo em `src/fragments/<QueryNativa>.ts` com nome = query nativa exata
- [ ] `fragment <QueryNativa> on Query { ... }` com o nome batendo
- [ ] `gql` de `@faststore/core/api`, chamado como função
- [ ] Só os campos que o componente/hook consome (sem overfetch)
- [ ] Conferido o default em `.faststore/.../fragments/` para não trazer a mais
- [ ] Consumo conectado (hook de página ou experimental correto)
- [ ] Avisado o usuário sobre rodar `yarn dev` para o codegen
      \=======

# create-fragment

Cria (ou sobrescreve) um **GraphQL fragment** de uma query nativa da FastStore em `src/fragments/`, com uma regra de ouro: **trazer só os campos que o componente realmente usa**. Fragment é o lever para moldar o payload das queries de página/busca — tanto para _adicionar_ campos quanto para manter a query enxuta.

Baseado em `.claude/docs/using-fragments.md` e `best-practices-graphql.md`. Relacionada a **`/extend-graphql`** (ver "Quando usar").

## Uso

```
/create-fragment <QueryNativa> [campos...]
```

**Exemplos:**

- `/create-fragment ClientSearchSuggestions` → busca traz só o termo sugerido
- `/create-fragment ClientProduct id name` → PDP client traz só o necessário

Se a query nativa não for informada, pergunte ao usuário (ver tabela abaixo).

---

## Quando usar

- **Use esta skill** quando o campo **já existe** no schema nativo e você só quer controlar **o que a query traz** — seja para enxugar (não trazer o que não usa) ou para incluir um campo nativo que ainda não está no fragment.
- **Use `/extend-graphql`** quando o campo **não existe** no schema (precisa de `typeDef` + `resolver` antes do fragment). Depois de declarado, o passo do fragment é exatamente o desta skill.

> Regra do projeto: **sempre enxugar a GraphQL** — trazer só os dados necessários. Overfetch em página custa performance (ver `best-practices` nas docs).

---

## Como funciona

O core já traz fragments-padrão em `.faststore/src/customizations/src/fragments/` (gerenciados pelo CLI — **não editar**). Um arquivo seu em **`src/fragments/<QueryNativa>.ts`** com o **mesmo nome** sobrescreve o default por convenção — a FastStore associa o fragment à query da página automaticamente, **sem import manual em lugar nenhum**.

> ⚠️ **O nome do arquivo e do fragment tem que ser exatamente o nome da query nativa** (tabela abaixo). `ClientSearchSuggestions.ts` → `fragment ClientSearchSuggestions on Query`.

### Queries nativas estendíveis

| Fragment / arquivo           | Side   | Query      | Página / uso               | Consome com                        |
| ---------------------------- | ------ | ---------- | -------------------------- | ---------------------------------- |
| `ServerProduct`              | Server | product    | PDP (`getStaticProps`)     | `usePDP()`                         |
| `ClientProduct`              | Client | product    | PDP (`useProductQuery`)    | `usePDP()`                         |
| `ServerCollectionPage`       | Server | collection | PLP (`getStaticProps`)     | `usePLP()`                         |
| `ClientProductGallery`       | Client | search     | PLP / Search               | `usePLP()` / `useSearchPage()`     |
| `ClientManyProducts`         | Client | search     | Shelf, Tiles, PLP, Search  | `usePage()` / `useProductsQuery`   |
| `ClientShippingSimulation`   | Client | shipping   | PDP                        | `useShippingSimulation_unstable()` |
| `ClientSearchSuggestions`    | Client | search     | SearchInput / busca        | `useSuggestions_unstable()`        |
| `ClientTopSearchSuggestions` | Client | search     | SearchInput (top searches) | `useTopSearch_unstable()`          |

---

## Passos

### 1. Identificar a query e o default atual

Veja o que o default já traz para não duplicar nem trazer a mais:

```bash
cat .faststore/src/customizations/src/fragments/<QueryNativa>.ts
```

### 2. Criar `src/fragments/<QueryNativa>.ts`

```ts
// src/fragments/ClientSearchSuggestions.ts
import { gql } from '@faststore/core/api'

export const fragment = gql(`
  fragment ClientSearchSuggestions on Query {
    search(first: 5, term: $term, selectedFacets: $selectedFacets) {
      suggestions {
        terms {
          value
        }
      }
    }
  }
`)
```

> **`gql` de `@faststore/core/api`**, chamado como **função** (`gql(\`...\`)`). Não use `@faststore/graphql-utils`(deprecado). Os arquivos do core usam`@generated`internamente — no **nosso**`src/fragments/`é`@faststore/core/api`.

### 3. Selecionar só o necessário

Peça apenas os campos que o componente/hook consome. No exemplo da busca, para uma lista de sugestões de texto, basta `suggestions.terms.value` (o termo sugerido) — nada de trazer cards de produto, `metadata`, etc. se a UI não usa.

---

## Exemplo: busca trazendo só o termo sugerido

O hook nativo `useSuggestions_unstable` roda a query `ClientSearchSuggestionsQuery`, que espalha o fragment `ClientSearchSuggestions`. Mantendo o fragment com só `terms { value }`, a lista de autocomplete recebe apenas o texto da sugestão — que é o dado necessário para o highlight do termo digitado.

```ts
// consumo (ex.: em use<Componente>.ts)
import { useSuggestions_unstable as useSuggestions } from '@faststore/core/experimental'

const { data } = useSuggestions(term)
const terms = data?.search?.suggestions?.terms ?? [] // [{ value }]
```

---

## Gotchas

- **Merge aditivo.** O fragment é mesclado na query base — ele molda o trecho que declara (ex.: `search { suggestions { ... } }`), mas **não remove** campos que o **hook do core** já pede fora do fragment. No `useSuggestions`, por exemplo, a query base também traz `suggestions.products { ...ProductSummary_product }`, `products.pageInfo.totalCount`, `metadata` e `searchId` — isso **não some** só mexendo no nosso fragment.
- **Fragments compartilhados têm efeito global.** Trimar algo como `ProductSummary_product` (usado por shelves, tiles, busca) afeta **todos** os consumidores. Só faça se for intencional e valide os outros usos.
- **Codegen só roda em `yarn dev`/`yarn build`.** O fragment novo só entra nos tipos `@generated` depois disso. Como aqui **não subimos servidor** (o usuário valida — ver `CLAUDE.md`), **avise o usuário para rodar `yarn dev` uma vez**; até lá `npx tsc --noEmit` pode não refletir a mudança (não é erro real).
- **Não editar** os fragments em `.faststore/` — sobrescreva criando em `src/fragments/` com o mesmo nome.

---

## Verificação

- `npx tsc --noEmit -p tsconfig.json` (com o caveat de codegen acima).
- **Nunca** subir servidor para validar — o usuário faz isso.

---

## Checklist final

- [ ] Arquivo em `src/fragments/<QueryNativa>.ts` com nome = query nativa exata
- [ ] `fragment <QueryNativa> on Query { ... }` com o nome batendo
- [ ] `gql` de `@faststore/core/api`, chamado como função
- [ ] Só os campos que o componente/hook consome (sem overfetch)
- [ ] Conferido o default em `.faststore/.../fragments/` para não trazer a mais
- [ ] Consumo conectado (hook de página ou experimental correto)
- [ ] Avisado o usuário sobre rodar `yarn dev` para o codegen

> > > > > > > 79bbe8f8dcb0599ce749a769d05c4ce2d46fe44b
