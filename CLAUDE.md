# FastStore Template — CLAUDE.md

## Visão Geral do Projeto

Projeto VTEX FastStore usando Next.js 13+ para criar uma loja headless. O FastStore usa uma arquitetura de duas camadas: o `@faststore/core` (gerenciado em `.faststore/`) fornece a base, e `/src` contém todas as customizações.

- **Plataforma:** VTEX
- **Framework:** Next.js 13 + React 18
- **Linguagem:** TypeScript
- **Estilização:** SCSS com sistema de design tokens
- **CMS:** FastStore Headless CMS (VTEX IO)
- **Build:** FastStore CLI (`faststore dev|build|start`)
- **Package Manager:** Yarn

---

## Estrutura do Projeto

```
/
├── .faststore/          # Gerenciado pelo CLI — NÃO editar diretamente
├── cms/
│   └── store/
│       ├── components/  # Um .jsonc por section (cms_component__<Nome>.jsonc)
│       └── pages/       # Content types customizados (.jsonc)
├── src/
│   ├── components/
│   │   ├── ui/          # Componentes de interface genéricos, sem regra de negócio
│   │   ├── layout/      # Estrutura visual das páginas (Header, TopBar, containers)
│   │   ├── commerce/    # Componentes do domínio de e-commerce (Cart, ProductCard, Shelf)
│   │   ├── providers/   # Contextos/providers globais (Context API, state management)
│   │   └── index.tsx    # Entrypoint: default export com o mapa de sections do CMS
│   ├── fonts/           # Configuração de web fonts
│   ├── fragments/       # GraphQL fragments customizados
│   ├── graphql/
│   │   ├── thirdParty/  # Resolvers e typeDefs de APIs externas
│   │   └── vtex/        # Resolvers e typeDefs VTEX customizados
│   ├── hooks/           # React hooks customizados
│   ├── pages/api/       # API routes Next.js
│   ├── sdk/             # Hooks de SDK (cart, product, search, analytics)
│   ├── styles/          # Mixins SCSS globais
│   ├── themes/
│   │   └── custom-theme.scss  # Design tokens globais (cores, tipografia, espaçamento)
│   ├── types/           # Tipos TypeScript globais
│   └── utils/           # Utilitários (api, formatadores, helpers)
├── discovery.config.js  # Config principal: SEO, VTEX account, session, URLs
├── vtex.env             # Variáveis de ambiente públicas
└── package.json
```

---

## Comandos Essenciais

```bash
yarn dev          # Inicia servidor de desenvolvimento (porta 3000)
yarn build        # Build de produção
yarn start        # Serve o build de produção
yarn cms-sync     # Sincroniza schemas do CMS com VTEX IO
yarn test         # Roda testes Cypress
```

> **Nota para o Claude:** NUNCA subir servidor (`yarn dev`, `yarn start`, etc.) — o usuário sempre valida visualmente por conta própria. Para verificação, usar apenas `npx tsc --noEmit -p tsconfig.json` (não existe script `typecheck`) e compilar SCSS isoladamente com `npx sass`.
>
> **Escopo da validação:** só considerar erros de arquivos dentro de `src/`. O `@faststore/core` é distribuído como código-fonte que usa aliases `src/*` resolvidos apenas pelo `.faststore/tsconfig.json`; ao rodar `tsc` na raiz, ele entra no grafo (via imports de `@faststore/core`) e gera centenas de erros pré-existentes que **não são do nosso código** e devem ser ignorados. Filtrar a saída do `tsc` pelos caminhos de `src/` — se não houver erro em `src/`, a checagem passou. O build real usa o tsconfig do `.faststore`, não o da raiz.

---

## Tipagem dos módulos do core

O `tsconfig.json` da raiz tem `paths` que espelham os do build:

```json
"paths": {
  "src/*": [".faststore/src/*"],
  "@generated": [".faststore/@generated/index.ts"],
  "@generated/*": [".faststore/@generated/*"]
}
```

Com isso o `tsc` da raiz resolve os módulos **reais** do core e do codegen. Regras:

- **Importar sempre do módulo real:** hooks/tipos do core vêm de `src/sdk/*`; tipos de GraphQL vêm de `@generated/graphql` (ex.: `Filter_FacetsFragment`, `ProductSummary_ProductFragment`). Para extrair um membro de união discriminada, usar `Extract<Filter_FacetsFragment, { __typename: 'StoreFacetRange' }>`.
- **NUNCA usar `declare module 'src/sdk/...'`** para "completar" um módulo do core. Declaração ambiente é global: sombreia o módulo inteiro para TODA a compilação — inclusive os arquivos do próprio core, que importam do mesmo especificador — e quebra o `yarn build` com erros em arquivos que não são nossos (`LandingPage.tsx`, `SKUMatrixSidebar.tsx`, etc.). Stubs assim também mascaram imports errados: um nome inventado no stub faz um import inexistente type-checar.
- **Tipos que são nossos** (campos que só existem por causa de resolver/fragment customizado, como `PDPVariantProduct`, `PDPInstallment`, `SkuVariation`) ficam em `src/types/faststore-custom.ts`, importado por **caminho relativo** — o alias `src/*` aponta para `.faststore/`, então `'src/types/...'` não resolve na raiz.
- Quando o codegen tipa um campo pelo fragment base do core mas um fragment nosso pede mais (caso do `allVariantProducts`), a asserção precisa passar por `unknown`: `x as unknown as PDPVariantProduct[]` — o cast direto falha no tsconfig do build por falta de overlap.

---

## Criando Componentes

### Camadas de componentes

`src/components/` é organizado em quatro camadas — todo componente novo deve entrar na camada certa:

| Camada       | O que é                                                                                                                                                                                                 | Exemplos                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `ui/`        | Componentes de interface genéricos e reutilizáveis, **sem regra de negócio**. Blocos de construção usados em qualquer parte do projeto. Inclui `ui/Icons/` (todos os ícones SVG, com barrel `index.ts`) | Button, Input, Dropdown, Drawer, Carousel, Tabs |
| `layout/`    | Estrutura visual das páginas: cabeçalho, rodapé e containers que organizam o posicionamento do conteúdo                                                                                                 | Header, TopBar, Footer, NavigationBanner        |
| `commerce/`  | Componentes específicos do domínio de e-commerce, com regra de negócio de produtos/carrinho/busca                                                                                                       | Cart, ProductCard, SkuSelector, Shelf, Search   |
| `providers/` | Componentes de contexto/providers (Context API, state management) que fornecem dados ou funcionalidades globais                                                                                         | —                                               |

Critério rápido: tem regra de negócio de e-commerce → `commerce/`; estrutura a página → `layout/`; fornece contexto global → `providers/`; caso contrário (genérico e reutilizável) → `ui/`.

### Estrutura padrão de um componente

Cada componente fica em sua própria pasta dentro da camada correspondente:

```
src/components/<camada>/MeuComponente/
├── MeuComponente.tsx          # Componente principal
├── MeuComponente.module.scss  # Estilos com CSS Modules
└── MeuComponente.types.ts     # Tipos TypeScript do componente
```

Domínios com sub-componentes próprios (ex.: `commerce/Cart/`, `commerce/Search/`, `layout/Header/`) agrupam as peças em subpastas dentro da pasta de domínio.

### Entrypoint global de componentes

`src/components/index.tsx` é o entrypoint que o FastStore usa para resolver as seções do CMS. O core importa o **`export default`** desse arquivo (`import CUSTOM_COMPONENTS from 'src/customizations/src/components'` e depois `...CUSTOM_COMPONENTS`), então o arquivo **precisa ter um default export** que seja um mapa `{ ChaveDaSection: Componente }` — as chaves devem bater com o `$componentKey` do schema.

⚠️ Se o arquivo tiver **só exports nomeados**, o `default` fica `undefined` e o build de produção falha com `Module '.../customizations/src/components/index' has no default export`. (Em dev local o erro não aparece; só `yarn build` reproduz.)

```tsx
// src/components/index.tsx
import Button from './ui/Button/Button'
import Header from './layout/Header/Header'
import Minicart from './commerce/Cart/Minicart/Minicart'

// Re-exports nomeados para uso direto entre componentes (opcional)
export { Button, Header, Minicart }

// Default: mapa de SECTIONS resolvidas pelo CMS (chave = $componentKey).
// Apenas sections (geralmente de layout/ e commerce/) entram aqui —
// componentes de ui/ não.
const COMPONENTS = {
  Header,
  Minicart,
}

export default COMPONENTS
```

### Recebendo props do CMS

As props do componente são definidas no schema `.jsonc` da section (ver abaixo) e injetadas automaticamente pelo CMS. O tipo das props deve refletir exatamente o schema definido no CMS.

---

## Schema do CMS (`cms/store/components/*.jsonc`)

Os arquivos `cms/store/components/cms_component__<Nome>.jsonc` são a **source of truth** para os componentes disponíveis no CMS — um arquivo por section. Cada um define:

```jsonc
{
  "$extends": ["#/$defs/base-component"],
  "$componentKey": "MeuComponente", // deve bater com a chave no default export de src/components/index.tsx
  "$componentTitle": "Meu Componente",
  "type": "object",
  "required": ["title"],
  "properties": {
    "title": {
      "title": "Título",
      "type": "string",
    },
    "items": {
      "title": "Itens",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "label": { "type": "string", "title": "Label" },
          "href": { "type": "string", "title": "Link" },
        },
      },
    },
  },
}
```

Campos de imagem usam `"widget": { "ui:widget": "media-gallery" }`; rich text usa `"ui:widget": "draftjs-rich-text"`.

### Campos condicionais (item de lista que pode ser "um objeto ou outro")

O editor do CMS é construído sobre [react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/) (por isso `ui:widget` funciona) e **suporta o padrão `dependencies` + `oneOf`** do JSON Schema para mudar os campos exibidos de acordo com um seletor — confirmado funcionando no editor visual da VTEX (ver `cms/store/components/cms_component__CategoryQuickNavigation.jsonc`, campo `link`).

Use isso quando um item de array precisa ser "um tipo A ou um tipo B" (ex.: destino que pode ser uma categoria filtrada OU um link manual):

```jsonc
"link": {
  "title": "Destino",
  "type": "object",
  "required": ["type"],
  "properties": {
    "type": {
      "title": "Tipo de destino",
      "type": "string",
      "enum": ["category", "link"],
      "enumNames": ["Categoria/Subcategoria", "Link direto"],
      "default": "category",
    },
  },
  "dependencies": {
    "type": {
      "oneOf": [
        {
          "properties": {
            "type": { "enum": ["category"] },
            "categorySlug": { "title": "Slug da categoria", "type": "string" },
          },
        },
        {
          "properties": {
            "type": { "enum": ["link"] },
            "href": { "title": "Link (URL)", "type": "string" },
          },
        },
      ],
    },
  },
}
```

Regras do padrão:

- O campo discriminador (`type` no exemplo) fica direto em `properties` do objeto pai, **sempre visível**
- `dependencies.<nomeDoDiscriminador>.oneOf` é um array de sub-schemas — cada um só precisa declarar `properties.<nomeDoDiscriminador>.enum` com o(s) valor(es) que ativam aquele branch, mais os campos extras que devem aparecer
- No `.types.ts`, modele como uma interface só com o discriminador e os campos extras opcionais (ex.: `{ type: 'category' | 'link'; categorySlug?: string; href?: string }`) — a união discriminada estrita do TypeScript não é necessária aqui, quem decide qual campo ler em runtime é o hook, checando `item.link.type`
- Documentar no `description` de cada branch o que ele faz, já que o editor não deixa isso óbvio

Após alterar um `.jsonc`, rodar `yarn cms-sync` — ele roda `vtex content generate-schema` (compila os `.jsonc` no artefato `cms_schema.json` na raiz, que não deve ser commitado) e `vtex content upload-schema` (sobe para o Schema Registry da conta configurada no script `upload`; exige `vtex login`).

---

## Sistema de Temas e Design Tokens

### Arquivo de tema

`src/themes/custom-theme.scss` define todos os design tokens globais. O tema é referenciado em `discovery.config.js` pela chave `theme: "custom-theme"`.

### Convenção de nomenclatura dos tokens

```scss
// Prefixo --fs- indica token FastStore
--fs-color-main-0         // namespacing + tipo + categoria + índice
--fs-text-size-base       // namespacing + tipo + categoria
--fs-spacing-4            // namespacing + tipo + escala
```

Partes do nome:

- `--fs` — namespace FastStore
- tipo — `color`, `text`, `spacing`, `border`, etc.
- categoria — `main`, `accent`, `neutral`, `body`, etc.
- modificador — estado, hierarquia, variante

### Tokens locais vs globais

- **Globais** (`custom-theme.scss`): afetam todo o sistema
- **Locais** (dentro do `.module.scss` do componente): sobrescrevem para aquele componente específico

```scss
.meuComponente {
  --fs-meu-componente-bg: var(--fs-color-main-0);
  background: var(--fs-meu-componente-bg);
}
```

### Sem comentários em SCSS

Arquivos `.scss` (incluindo `.module.scss`) não devem ter comentários — nem `//` nem `/* */`. Nomes de classes, variáveis e tokens já devem ser autoexplicativos; se uma referência ao Figma ou uma regra de negócio for necessária, ela pertence à descrição do PR, não ao arquivo de estilo.

### Comentários em TSX/TS

Em arquivos `.tsx`/`.ts`, só duas situações justificam comentário:

- **Regra obscura da VTEX/FastStore** — comportamento não óbvio da plataforma, workaround para bug específico, ou constraint que surpreenderia quem lê o código sem esse contexto.
- **JSDoc do componente e de suas props** — descrição do componente (o que ele é, quando é usado) e/ou de cada prop na interface `.types.ts`.

Fora isso, sem comentários: nomes de variáveis/funções autoexplicativos já cobrem o "o quê"; não comentar lógica óbvia, não referenciar a task/fix atual, não referenciar o Figma (frame, medida, nome de layer), não deixar comentários tipo `// removido X`.

---

## GraphQL Customizado

### Adicionando um resolver de terceiros

1. Criar `src/graphql/thirdParty/typeDefs/meuServico.graphql` com a definição do schema
2. Criar `src/graphql/thirdParty/resolvers/meuServico.ts` com a implementação
3. Exportar o resolver em `src/graphql/thirdParty/resolvers/index.ts`

### Fragments customizados

Fragments adicionam campos extras às queries padrão do FastStore:

```ts
// src/fragments/ServerProduct.ts
import { gql } from '@faststore/core/api'

export const fragment = gql`
  fragment ServerProduct on StoreProduct {
    customField: description
  }
`
```

---

## SDK Hooks

Hooks em `src/sdk/` encapsulam lógica de negócio e estado da loja:

| Hook                     | Finalidade                      |
| ------------------------ | ------------------------------- |
| `useAddToCart`           | Adicionar produto ao carrinho   |
| `useProductContext`      | Acessar dados do produto na PDP |
| `useProductsQuery`       | Buscar lista de produtos        |
| `useSearchProductsQuery` | Busca com facetas               |
| `useWishlist`            | Gerenciar lista de desejos      |
| `useDevice`              | Detectar dispositivo do usuário |

---

## Configuração VTEX (`discovery.config.js`)

Principais seções:

```js
module.exports = {
  platform: 'vtex',
  api: {
    storeId: 'nome-da-conta', // conta VTEX
    workspace: 'master',
    environment: 'vtexcommercestable',
    hideUnavailableItems: true,
  },
  session: {
    currency: { code: 'BRL', symbol: 'R$' },
    locale: 'pt-BR',
    channel: '{"salesChannel":"1","regionId":""}',
    country: 'BRA',
  },
  theme: 'custom-theme', // nome do arquivo em src/themes/
}
```

---

## Regras Importantes

- **Nunca editar** arquivos dentro de `.faststore/` — são gerados/gerenciados pelo CLI e sobrescritos no build
- Componentes ficam nas camadas `src/components/{ui,layout,commerce,providers}/` — respeitar o critério de cada camada; `ui/` nunca deve importar de `commerce/` ou `layout/` (dependência só flui na direção contrária)
- O **entrypoint de componentes** é `src/components/index.tsx` — ele **precisa ter um `export default`** com o mapa de sections (organismos) para o CMS resolver os componentes; só exports nomeados quebram o build de produção
- Cada section registrada precisa de um **`cms/store/components/cms_component__<Nome>.jsonc`** com `$componentKey` idêntico à chave no mapa default de `src/components/index.tsx`; após alterações, rodar `yarn cms-sync`
- Ao mover/renomear um componente para dentro de outro domínio, o nome local perde o prefixo do domínio (ex.: `NavigationItem` dentro de `Header/Navigation/` vira `Item`). Quando esse nome curto é importado **fora do contexto original** e ficaria ambíguo lá, use um alias semântico no import — `import type { BannerProps as NavigationBannerProps } from './Navigation/Banner/Banner.types'` — mantendo o nome curto na definição e o nome qualificado no ponto de uso externo
- O **`cms_schema.json`** gerado na raiz é artefato de build do `cms-sync` — não commitar
- Variáveis de ambiente **privadas** (API keys, secrets) devem usar VTEX Secrets — nunca commitar em `vtex.env`
- `vtex.env` só deve conter variáveis **públicas**
- **Arquivos `.scss` não devem ter comentários** (nem `//` nem `/* */`) — ver "Sem comentários em SCSS" acima
- **Em `.tsx`/`.ts`, comentário só para regra obscura da VTEX/FastStore ou JSDoc de componente/props** — ver "Comentários em TSX/TS" acima
