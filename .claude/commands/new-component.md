# new-component

Cria um novo componente FastStore seguindo a arquitetura em camadas e os padrões do projeto.

## Uso

```
/new-component <NomeDoComponente> [ui|layout|commerce|providers]
```

**Exemplos:**

- `/new-component Badge ui`
- `/new-component Footer layout`
- `/new-component SkuSelector commerce`

---

## O que fazer

Você receberá o nome do componente e, opcionalmente, a camada (`ui`, `layout`, `commerce`, `providers`). Se a camada não for informada e não for óbvia pelo nome/contexto, pergunte ao usuário.

### Camadas — regras de organização

| Camada         | O que é                                                                                                                                               | Exemplos                                      |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **ui/**        | Componente de interface genérico e reutilizável, **sem regra de negócio**. Bloco de construção usado em qualquer parte do projeto. Inclui `ui/Icons/` | Button, Input, Drawer, Modal, Badge, Spinner  |
| **layout/**    | Estrutura visual das páginas: cabeçalho, rodapé, containers de posicionamento                                                                         | Header, Footer, TopBar, Container             |
| **commerce/**  | Componente do domínio de e-commerce, com regra de negócio de produtos/carrinho/busca                                                                  | Cart, ProductCard, SkuSelector, Shelf, Search |
| **providers/** | Contexto/provider (Context API, state management) que fornece dados ou funcionalidades globais                                                        | CartProvider, ThemeProvider                   |

**Regras de dependência:** `ui/` nunca importa de `layout/`, `commerce/` ou `providers/` — a dependência só flui na direção contrária (camadas de domínio consomem `ui/`).

**Sections do CMS:** componentes registrados no CMS (sections) geralmente vivem em `layout/` ou `commerce/`; componentes de `ui/` nunca são sections.

---

## Passos de criação

### 1. Identificar onde criar

Todos os componentes ficam em `src/components/<camada>/<NomeDoComponente>/`, onde `<camada>` é `ui`, `layout`, `commerce` ou `providers` (ver tabela acima).

Estrutura de referência (arquivos com `*` são opcionais, criados só quando necessário):

```
src/components/<camada>/<NomeDoComponente>/
├── <NomeDoComponente>.tsx          # apresentação (View) — só JSX e composição
├── <NomeDoComponente>.types.ts     # contratos (interfaces/props)
├── <NomeDoComponente>.module.scss  # estilos com CSS Module
└── use<NomeDoComponente>.ts        # * lógica/estado/efeitos (quando houver)│   ├── components/
│   │   ├── ui/          # Componentes de interface genéricos, sem regra de negócio
│   │   ├── layout/      # Estrutura visual das páginas (Header, TopBar, containers)
│   │   ├── commerce/    # Componentes do domínio de e-commerce (Cart, ProductCard, Shelf)
│   │   ├── providers/   # Contextos/providers globais (Context API, state management)
│   │   └── index.tsx    # Entrypoint: default export com o mapa de sections do CMS
```

**Princípio geral: separar apresentação de lógica.** O `.tsx` deve ser o mais declarativo possível. Estado, efeitos, handlers, navegação por teclado e acessibilidade vão para um hook (ver passo 3.1). Ícones SVG inline vão para a pasta `Icons/` (ver passo 3.2).

#### 1.1 Agrupamento por domínio (componentes com sub-componentes próprios)

Quando um componente tem **sub-componentes muito específicos dele** — peças que só fazem sentido dentro daquele domínio e **não são reutilizáveis** por outras partes da loja (diferente dos componentes genéricos de `ui/`) — agrupe tudo numa **pasta de domínio** dentro da camada, em vez de espalhar pastas irmãs.

Regra prática:

- Crie uma pasta de domínio `src/components/<camada>/<Dominio>/` (ex.: `commerce/Search/`, `commerce/Cart/`) e coloque cada sub-componente numa subpasta própria dentro dela.
- **Dropar o prefixo do domínio** no nome do sub-componente — a pasta pai já carrega o contexto. Ex.: `Search/Drawer`, `Search/Suggestions` (não `Search/SearchDrawer`).
- Cada subpasta segue a mesma estrutura padrão do passo 1 (`.tsx` / `.types.ts` / `.module.scss` / `use*.ts`).

```
src/components/commerce/Search/   # domínio (na camada commerce)
├── Drawer/                       # section específica de busca
│   ├── Drawer.tsx
│   └── Drawer.module.scss
└── Suggestions/                  # sub-componente específico de busca
    ├── Suggestions.tsx
    ├── Suggestions.types.ts
    ├── Suggestions.module.scss
    └── useSuggestions.ts
```

Assim, tudo o que é de Search fica dentro de `commerce/Search/`, em vez de `SearchDrawer/` + `SearchSuggestions/` soltos.

**Genérico vs. específico:** componentes-base reutilizáveis por vários domínios (ex.: o `Drawer` genérico que serve tanto ao minicart quanto à busca) ficam em **`ui/`** (`src/components/ui/Drawer/`) — não entram na pasta de domínio. O componente de domínio consome o base por caminho.

**Componente que É o domínio (ex.: `Header`):** quando o domínio tem um componente-raiz principal (o `Header`) mais sub-componentes dele (`MegaMenu`, `Navigation`), o raiz fica direto em `src/components/<camada>/<Dominio>/` (`layout/Header/Header.tsx`) e os sub-componentes em subpastas (`layout/Header/MegaMenu/`, `layout/Header/Navigation/`).

**SCSS por sub-componente (padrão) — inclusive com estado compartilhado:** cada sub-componente tem o seu `<Nome>.module.scss` (classe raiz = nome do componente, prefixo dropado — como `.nav`, `.megaMenu`, `.departments`). Estados visuais que parecem "compartilhados" (ex.: o header ficar sólido no hover, trocando a cor de textos/ícones da nav e do painel) **não** obrigam a manter um stylesheet único, porque o acoplamento é por **DOM**, não por arquivo:

- Coloque na **casca do domínio** (`<Dominio>.module.scss`, no elemento-raiz `.header`) o que é do raiz: definição da **CSS custom property** herdada (`--header-content-color`), os estados `:hover`/`:focus-within`, overlays (`::before`) e o layout raiz.
- Os sub-componentes consomem a variável via `var(--…)`/`currentColor`. CSS Modules **não escopa custom properties** (só classes e `@keyframes`), então o nome atravessa a fronteira dos arquivos e a herança acontece em runtime pela árvore do DOM. Requisito: nenhum seletor combinador cruzando componentes (`.header:hover .navLink {}`) — a mudança flui pela variável, não por descendência.
- Mixins que geram `@keyframes` (ex.: `slide-in`/`slide-out`) emitem o keyframe **dentro do próprio `@include`**: mantenha o `@include` no arquivo da classe que o usa, e o scoping por módulo permanece consistente.

**Tipos de domínio compartilhados:** quando os tipos são um **contrato único** do domínio (ex.: `HeaderNavigationItem`/`NavigationNode`, usados por raiz e sub-componentes), mantenha um `<Dominio>.types.ts` **na raiz do domínio** e importe das subpastas via `../`. Tipos exclusivos de um sub-componente ficam no `.types.ts` dele.

**Colisão de nome:** ao dropar o prefixo, o sub-componente pode ficar com o mesmo nome de um base genérico (ex.: `Search/Drawer` × `Drawer` genérico). Isso é esperado — resolva no import dando um alias ao base:

```tsx
// src/components/commerce/Search/Drawer/Drawer.tsx
import BaseDrawer from '../../../ui/Drawer/Drawer' // base genérico de ui/, aliased
import Suggestions from '../Suggestions/Suggestions'
```

**Atenção à profundidade:** com as camadas, os componentes ficam um nível mais fundo — o `@use` do SCSS é `../../../styles/globals` para `src/components/<camada>/<Nome>/` e `../../../../styles/globals` para `src/components/<camada>/<Dominio>/<Sub>/`; imports de `ui/Icons/`, bases de `ui/`, etc. seguem a mesma lógica.

> Regra de bolso: **só agrupe em domínio quando houver 2+ peças específicas daquele contexto** (um componente-raiz + seus sub-componentes dedicados). Um componente isolado, sem sub-componentes próprios, permanece direto em `src/components/<camada>/<Nome>/`.

### 2. Criar `<NomeDoComponente>.types.ts`

- Exportar a interface principal como `<NomeDoComponente>Props`
- Props devem ter nomes claros e descritivos em camelCase
- Usar tipos primitivos e interfaces — evitar `any`
- Props opcionais com `?` quando tiverem valor padrão
- Para sections do CMS: as props devem espelhar exatamente o schema que será declarado no `.jsonc` da section

```ts
// Exemplo ui/ (genérico)
export interface ButtonProps {
  label: string
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  onClick?: () => void
}

// Exemplo section do CMS (props espelham o schema .jsonc)
export interface ProductShelfProps {
  title: string
  productCluster: string
  itemsPerPage?: number
  showArrows?: boolean
}
```

### 3. Criar `<NomeDoComponente>.tsx`

Estrutura obrigatória:

```tsx
import type { <NomeDoComponente>Props } from './<NomeDoComponente>.types'
import styles from './<NomeDoComponente>.module.scss'

function <NomeDoComponente>({ prop1, prop2 }: <NomeDoComponente>Props) {
  return (
    <div className={styles.<nomeDoComponente>}>
      {/* conteúdo */}
    </div>
  )
}

export default <NomeDoComponente>
```

Regras de qualidade:

- Componente funcional (nunca classe)
- Desestruturar props diretamente na assinatura
- Sem `React.FC` — tipar via interface diretamente
- Sem `export default` inline quando o componente tiver lógica (legibilidade)
- `className` sempre usando `styles.<nome>` do CSS Module
- Sem comentários óbvios — só adicionar quando o comportamento for não-óbvio
- Para sections do CMS: aceitar e repassar props corretamente vindas do CMS

### 3.1 Extrair lógica para um hook `use<NomeDoComponente>.ts`

**Sempre que o componente tiver lógica não-trivial** — estado (`useState`), efeitos (`useEffect`), refs, handlers de teclado/mouse, controle aberto/fechado, lógica controlado/não-controlado — essa lógica **deve sair do `.tsx`** e ir para um hook customizado na própria pasta do componente.

Objetivo: o `.tsx` fica só com apresentação (View) e o hook concentra o comportamento (Controller), ficando testável isoladamente e reutilizável por outras "peles" do mesmo componente.

```ts
// src/components/<camada>/<NomeDoComponente>/use<NomeDoComponente>.ts
import { useState } from 'react'

import type { <NomeDoComponente>Option } from './<NomeDoComponente>.types'

interface Use<NomeDoComponente>Params {
  // só o que a lógica precisa receber do componente
}

// Funções puras (sem hooks) ficam no escopo do módulo, fora do hook
function helperPuro(/* ... */) {
  /* ... */
}

export function use<NomeDoComponente>(params: Use<NomeDoComponente>Params) {
  const [isOpen, setIsOpen] = useState(false)
  // estado, efeitos, refs, handlers...

  return {
    // estado e handlers que a View consome
  }
}
```

```tsx
// <NomeDoComponente>.tsx — só renderiza
function <NomeDoComponente>(props: <NomeDoComponente>Props) {
  const { isOpen, /* ... */, handleClick } = use<NomeDoComponente>({ /* ... */ })

  return <div>{/* JSX usando o que o hook devolveu */}</div>
}
```

Regras:

- Nome do arquivo e do hook: `use<NomeDoComponente>` (camelCase, prefixo `use`)
- Funções puras (sem hooks) vão no escopo do módulo, não dentro do hook
- O hook retorna um objeto nomeado (estado + handlers), nunca um array posicional grande
- Componentes puramente visuais (sem estado) **não** precisam de hook — não criar por criar

### 3.2 Extrair ícones SVG para `src/components/ui/Icons/`

**Nunca deixar `<svg>` inline dentro do JSX de um componente.** Todo ícone vira um componente próprio em `src/components/ui/Icons/`, com um barrel `index.ts`.

```
src/components/ui/Icons/
├── ChevronDownIcon.tsx
├── CloseIcon.tsx
└── index.ts            # barrel: export { default as ... }
```

```tsx
// src/components/ui/Icons/ChevronDownIcon.tsx
import type { SVGProps } from 'react'

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ChevronDownIcon
```

```ts
// src/components/ui/Icons/index.ts
export { default as ChevronDownIcon } from './ChevronDownIcon'
```

Regras:

- Nome do componente/arquivo termina em `Icon` (ex.: `ChevronDownIcon`)
- Tipar com `SVGProps<SVGSVGElement>` e espalhar `{...props}` para permitir `className`, `width`, etc.
- Usar `stroke="currentColor"`/`fill="currentColor"` para herdar a cor via CSS (`color`)
- `aria-hidden="true"` por padrão (ícone decorativo); deixar o consumidor sobrescrever via props
- Ícones **não** vão no entrypoint `src/components/index.tsx` (não são componentes de CMS) — importá-los direto de `ui/Icons` pelo caminho relativo (ex.: `../Icons` de dentro de `ui/`, `../../ui/Icons` de `commerce/<Nome>/`)

### 3.3 Precisa de dado da API? Skills `/create-fragment` e `/extend-graphql`

Se o componente consome dado da FastStore API, **não** invente fetch manual nem API Route. Escolha a skill pelo caso:

- **Campo já existe no schema, mas você quer controlar o payload** (trazer só o necessário / incluir um campo nativo que o fragment ainda não pede) → rode **`/create-fragment`**. É o caso mais comum: moldar/enxugar a query de uma página ou busca (ex.: sugestões trazendo só `terms.value`).
- **Campo não existe no schema nativo** (dado extra de uma API VTEX) → rode **`/extend-graphql`**: `typeDef` + `resolver` (`src/graphql/vtex/`) → `fragment` (`src/fragments/`) → consumo. O passo de fragment dela reusa o `/create-fragment`.

Consumo em ambos: `usePDP()`/`usePLP()`/`useSearchPage()`/`usePage()` de `@faststore/core` (seções em página), ou os hooks experimentais de `@faststore/core/experimental` (ex.: `useSuggestions_unstable`) fora de contexto de página.

Quando **não** aplicar nenhuma das duas:

- O dado já vem das **props do CMS**, ou
- Já existe **hook/SDK nativo** que entrega o dado pronto (ex.: `useSuggestions_unstable` para sugestões) e o fragment atual já traz os campos usados — nesse caso, só consuma.

> Detalhe embutido nas skills: mudanças de schema/fragment só entram nos tipos `@generated` após `yarn dev`/`yarn build` — como aqui não subimos servidor, avise o usuário para rodar `yarn dev` uma vez.

### 3.4 Comunicação por eventos — `src/utils/events.ts`

**Nunca use `window.dispatchEvent`/`addEventListener` crus, nem strings de evento soltas.** Toda comunicação por eventos passa pelo utilitário `src/utils/events.ts`, que tem duas camadas distintas — escolha pela natureza do evento:

**`on(target, type, handler)` — eventos nativos do DOM.** Substitui o par `addEventListener`/`removeEventListener` e **devolve o cleanup**, pronto para retornar de um `useEffect`. Use para `keydown`, `click` fora, `scroll`, `resize`, etc. O `type` é autocompletado e o `event` vem tipado conforme o alvo (`document` → `DocumentEventMap`, `window` → `WindowEventMap`, `HTMLElement` → `HTMLElementEventMap`).

```ts
// dentro do use<NomeDoComponente>.ts (em src/components/<camada>/<Nome>/)
import { on } from '../../../utils/events'

useEffect(() => {
  const offKeyDown = on(document, 'keydown', (event) => {
    if (event.key === 'Escape') close()
  })

  return offKeyDown // ou combine com outros cleanups
}, [close])
```

**`dispatch` / `listen` — barramento da aplicação (comunicação entre componentes desacoplados).** Para um componente avisar outro sem conhecê-lo nem receber refs/callbacks via props (ex.: o botão do Header abre o Search Drawer). Trafega como `CustomEvent` no `window`.

Regras do barramento:

- **O nome do evento é sempre um membro do `enum EventName`** — nunca uma string crua. Antes de disparar/escutar um evento novo, **catalogue-o em dois pontos do `events.ts`**: adicione o membro no `EventName` e a entrada correspondente no `AppEventMap` (`void` = sem payload; ou o tipo do `detail`).

```ts
// src/utils/events.ts
export enum EventName {
  OpenSearchDrawer = 'search-drawer:open',
  OpenCartDrawer = 'cart-drawer:open', // novo evento
}

export interface AppEventMap {
  [EventName.OpenSearchDrawer]: void
  [EventName.OpenCartDrawer]: void // catalogado → dispatch/listen ganham o nome tipado
}
```

- **Disparar** (tipicamente dentro de um hook `use<NomeDoComponente>`, memoizado): `dispatch(EventName.OpenCartDrawer)`. Se o evento tiver `detail` no mapa, o `dispatch` passa a exigir o payload como 2º argumento.

```ts
// use<NomeDoComponente>.ts — o componente só emite, não conhece quem escuta
import { useCallback } from 'react'
import { dispatch, EventName } from '../../../utils/events'

export function use<NomeDoComponente>() {
  const openCart = useCallback(() => dispatch(EventName.OpenCartDrawer), [])
  return { openCart }
}
```

- **Escutar**: `listen(EventName.OpenCartDrawer, (detail) => { ... })` — devolve o cleanup, igual ao `on`. O `detail` vem tipado pelo `AppEventMap`.

Ambos (`dispatch`/`listen`) já têm guarda de SSR (`typeof window`), então são seguros para chamar em módulos avaliados no servidor — mas escuta sempre dentro de `useEffect`.

**Como decidir:**

- Handler é uma **prop do React** (`onClick`, `onChange` no JSX)? Não é evento imperativo — deixe no JSX, não passa pelo util.
- Evento **nativo do DOM** ouvido imperativamente (`keydown` global, etc.)? → **`on`**.
- Um componente precisa **avisar outro desacoplado** (drawer, overlay, modal)? → **`dispatch`/`listen`** com um membro do `EventName`.

### 4. Criar `<NomeDoComponente>.module.scss`

O módulo começa sempre com o `@use` do entrypoint global:

```scss
@use '../../../styles/globals' as *;

.nomeDoComponente {
  // estilos usando variáveis e mixins do projeto
}
```

> O caminho relativo depende da profundidade do componente:
>
> - `src/components/<camada>/Foo/` → `@use '../../../styles/globals' as *`
> - `src/components/<camada>/Dominio/Bar/` → `@use '../../../../styles/globals' as *`

Regras de qualidade:

- Sempre iniciar com `@use '...styles/globals' as *` — nunca importar arquivos de config individualmente
- **Nunca** usar tokens `--fs-*` nativos do FastStore
- **Nunca** usar valores hardcoded de cor, espaçamento ou tipografia
- Usar as variáveis SCSS do projeto (`$color-*`, `$font-size-*`, etc.) e os mixins (`font()`, `gradient-linear()`, etc.)
- Classe raiz com o nome do componente em camelCase

### Variáveis e mixins disponíveis

**Cores** (`$color-*`):

```scss
$color-primary / $color-primary-dark / $color-primary-light
$color-secondary
$color-neutral-100 ... $color-neutral-900
$color-surface        // fundo de cards e superfícies
$color-text           // texto padrão
$color-text-muted     // texto secundário
$color-border
$color-error / $color-success / $color-warning
```

**Mixins de cor:**

```scss
@include gradient-linear(to right, $color-primary, $color-secondary);
@include gradient-radial(circle, $color-primary, $color-primary-light);
```

**Tipografia** — fonte única: Outfit

Para headings, usar os mixins semânticos `h*-size-d` (desktop) e `h*-size-m` (mobile). Cada mixin encapsula tamanho, peso e line-height do Figma — só precisa passar a cor:

```scss
// Desktop headings
@include h1-size-d($color-text-dark); // 86px / 500 / 120%
@include h2-size-d($color-text-dark); // 60px / 500 / 120%
@include h3-size-d($color-text-dark); // 24px / 500 / 120%
@include h4-size-d($color-text-dark); // 20px / 500 / 120%
@include h5-size-d($color-text-mid); // 16px / 500 / 120%
@include h6-size-d($color-text-mid); // 12px / 500 / 120%

// Mobile headings (dentro de media query)
@include h1-size-m($color-text-dark); // 45px / 500 / 120%
@include h3-size-m($color-text-dark); // 20px / 600 / 120%

// Alinhamento centralizado (parâmetro opcional)
@include h2-size-d($color-text-dark, $text-align: center);

// Body / UI — usar mixin font() com escala utilitária
@include font($font-size-base, $font-weight-regular, $color-text);
@include font($font-size-sm, $font-weight-medium, $color-text-muted);
```

**Subtitle / Lead:**

```scss
@include subtitle-size-1($color-text-dark); // 18px / 500 / 150%
@include subtitle-size-2($color-text-muted); // 16px / 500 / 120%
```

**Paragraph** — peso variável (light/regular/medium):

```scss
@include paragraph-p1($color-text); // 16px / regular / 140%
@include paragraph-p1($color-text, $font-weight-light); // 16px / light   / 140%
@include paragraph-p2(
  $color-text-muted,
  $font-weight-medium
); // 14px / medium  / 140%
@include paragraph-p3($color-text-muted); // 12px / regular / 140%
```

**`font()`** — para labels, captions e UI sem token semântico correspondente.

**Exemplo de módulo completo:**

```scss
@use '../../../styles/globals' as *;

.productCard {
  background: $color-surface;

  &__title {
    @include font($font-size-lg, $font-weight-bold, $color-text);
  }

  &__price {
    @include font($font-size-md, $font-weight-semibold, $color-primary);
  }

  &__badge {
    @include gradient-linear(135deg, $color-primary, $color-primary-dark);
    @include font($font-size-xs, $font-weight-bold, $color-surface);
  }
}
```

> Se uma variável necessária não existir ainda em `src/styles/config/`, **criá-la** no arquivo correspondente (`_colors.scss`, `_typography.scss`, etc.) seguindo a convenção antes de usá-la.

### 5. Registrar em `src/components/index.tsx`

⚠️ **Crítico para o build.** O core do FastStore resolve as sections customizadas pelo **`export default`** desse arquivo: `import CUSTOM_COMPONENTS from 'src/customizations/src/components'` e depois `...CUSTOM_COMPONENTS`. Por isso o entrypoint **precisa ter um default export** que seja um mapa `{ ChaveDaSection: Componente }` — as chaves devem bater com o `$componentKey` do schema do CMS.

Se o arquivo tiver **apenas exports nomeados** (`export { default as X } from ...`), o `default` fica `undefined` e o build de produção falha com:
`Module '.../customizations/src/components/index' has no default export`.

Padrão correto:

```tsx
import Button from './ui/Button/Button'
import Header from './layout/Header/Header'
import Minicart from './commerce/Cart/Minicart/Minicart'

// Re-exports nomeados para uso direto entre componentes (opcional, mas conveniente)
export { Button, Header, Minicart }

// Default: mapa de SECTIONS resolvidas pelo CMS (chave = $componentKey).
// Apenas sections (geralmente de layout/ e commerce/) entram aqui — ui/ não.
const COMPONENTS = {
  Header,
  Minicart,
}

export default COMPONENTS
```

Regras:

- **Sempre** manter um `export default` com o mapa de sections — nunca deixar o arquivo só com exports nomeados
- Só **sections do CMS** entram no mapa (geralmente componentes de `layout/` e `commerce/`); componentes de `ui/` são importados diretamente de suas pastas
- A chave no mapa = `$componentKey` do `cms_component__*.jsonc` correspondente
- Validar com `yarn build` (não só `tsc -p tsconfig.json`): o erro de default export só aparece no build do core, que o `tsconfig` local não cobre

### 6. Para sections: criar `cms/astra/components/cms_component__<Nome>.jsonc`

**Formato do schema:**

Nome dos arquivos deve ser obrigatório começar esses prefixos:

Component: `cms_component__`

Content Type: `cms_content_type__`

Exemplo de um Component:

```json
*// cms/astra/components/cms_component__Banner.jsonc*
{
  "$extends": ["#/$defs/base-component"],
  "$componentKey": "Banner",
  "$componentTitle": "Banner",
  "type": "object",
  "required": ["title"],
  "properties": {
    "title": {
      "title": "Title",
      "type": "string"
    },
    "image": {
      "type": "object",
      "title": "Image",
      "properties": {
        "src": {
          "type": "string",
          "title": "Image",
          "widget": {
            "ui:widget": "media-gallery"
          }
        },
        "alt": {
          "type": "string",
          "title": "Alternative Label"
        }
      }
    }
  }
}
```

DOCS:

https://developers.vtex.com/docs/guides/content-plugin

https://developers.vtex.com/docs/guides/understanding-cms-architecture-and-schema-declarations#schema-format-comparison

````

Lembrar ao usuário de rodar `yarn cms-sync` após alterar o `sections.json`.

#### 6.1 Item de lista que pode ser "um objeto ou outro" — campos condicionais

O editor do CMS roda sobre [react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/) (é por isso que `ui:widget` funciona) e **suporta `dependencies` + `oneOf`** do JSON Schema para alternar quais campos aparecem de acordo com um seletor — confirmado funcionando no editor visual da VTEX (ver `cms/astra/components/cms_component__CategoryQuickNavigation.jsonc`, campo `link`, que alterna entre "Slug da categoria" e "Link (URL)" conforme o "Tipo de destino" escolhido).

Use esse padrão sempre que um item de array precisar representar "um tipo A **ou** um tipo B" em vez de expor todos os campos possíveis de uma vez (ex.: destino que pode ser uma categoria filtrada OU um link manual, uma mídia que pode ser imagem OU vídeo com props diferentes, etc.):

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
````

Regras do padrão:

- O campo discriminador (`type` no exemplo) fica direto em `properties` do objeto pai e fica **sempre visível** — é ele quem decide qual branch renderizar
- `dependencies.<nomeDoDiscriminador>.oneOf` é um array de sub-schemas — cada um declara `properties.<nomeDoDiscriminador>.enum` com o(s) valor(es) que ativam aquele branch, mais os campos extras exclusivos daquele branch
- No `<NomeDoComponente>.types.ts`, modele o objeto condicional como uma interface com o discriminador obrigatório e os campos de cada branch opcionais (ex.: `interface FooLink { type: 'category' | 'link'; categorySlug?: string; href?: string }`) — não é preciso forçar união discriminada estrita do TypeScript aqui, quem decide qual campo ler em runtime é o hook, checando `item.link.type` (ver `useCategoryQuickNavigation.ts` como referência)
- Sempre documentar no `description` de cada branch o que ele significa, já que o editor não deixa isso óbvio para quem preenche o conteúdo
- Validar visualmente no editor da VTEX após `yarn cms-sync`: o `tsc`/`yarn build` não pegam erro de schema condicional mal-formado, só o comportamento do editor confirma

---

## Checklist final antes de entregar

- [ ] Componente criado na **camada certa** (`ui/`, `layout/`, `commerce/`, `providers/`); `ui/` sem regra de negócio e sem importar das outras camadas
- [ ] Sub-componentes específicos de um domínio agrupados em `src/components/<camada>/<Dominio>/` com prefixo dropado (ver 1.1); bases genéricos ficam em `ui/`
- [ ] `<NomeDoComponente>.types.ts` com interface exportada
- [ ] `<NomeDoComponente>.tsx` usando CSS Module e tipagem correta — **só apresentação**
- [ ] Lógica não-trivial extraída para `use<NomeDoComponente>.ts` (estado/efeitos/handlers fora do `.tsx`)
- [ ] Nenhum `<svg>` inline — ícones em `src/components/ui/Icons/` com barrel `index.ts`
- [ ] Eventos via `src/utils/events.ts`: `on()` para eventos nativos do DOM; `dispatch`/`listen` com membro do `EventName` para comunicação entre componentes — nenhum `addEventListener`/`dispatchEvent` cru nem string de evento solta. Evento novo catalogado em `EventName` + `AppEventMap`
- [ ] `<NomeDoComponente>.module.scss` com classe raiz e tokens
- [ ] `src/components/index.tsx` tem `export default` com o mapa de sections; componentes de `ui/` e ícones **não** entram no mapa
- [ ] Build validado com `yarn build` (não só `tsc`) — pega o erro de default export do core
- [ ] Se organism: seção adicionada ao `cms/faststore/sections.json`
- [ ] Se algum item de lista representa "um tipo A ou um tipo B" (destino de link, mídia com props variáveis, etc.): usar `dependencies` + `oneOf` (ver 6.1) em vez de expor todos os campos de todos os tipos ao mesmo tempo
- [ ] Sem `any`, sem valores hardcoded de design, sem comentários desnecessários
- [ ] Módulo SCSS inicia com `@use '...styles/globals' as *`
- [ ] Todos os valores visuais usam variáveis SCSS do projeto (`$color-*`, `$font-size-*`, etc.) ou o mixin `font()`
- [ ] Nenhum token `--fs-*` nativo do FastStore e nenhum valor hardcoded nos estilos

---

## Ao terminar

Mostre ao usuário:

1. Os arquivos criados com seus caminhos
2. Se o componente compõe atoms/molecules existentes, sugerir quais reutilizar

```

```
