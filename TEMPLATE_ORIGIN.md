# Origem do Template

Este template nasceu da **loja Astra** (VTEX FastStore v4). O objetivo foi extrair a base
reutilizável e remover tudo que era regra de negócio específica daquele cliente.

## Commits

| Commit    | O que fez                                                                         |
| --------- | --------------------------------------------------------------------------------- |
| `2f54e2f` | Snapshot inicial da loja Astra                                                     |
| `5ef2395` | Renomeia `cms/astra/` → `cms/store/`, remove menções ao nome da loja               |
| `7824eb9` | Remove componentes e resolvers específicos do cliente (~5.9k linhas deletadas)     |
| `ef796fb` | Merge com `origin/master` (`--allow-unrelated-histories`) para viabilizar o PR     |

## Renomeado

- `cms/astra/` → `cms/store/` (todos os `cms_component__*.jsonc` e o content type `landingPage`)
- `discovery.config.js`, `vtex.env`, `package.json`, `CLAUDE.md` — removidas referências à conta/nome da loja

## Removido

**Componentes de domínio do cliente**

- `layout/EsgJourney/` (+ `StatItem`, `Tabs`, `useEsgJourney`) — seção institucional de ESG
- `layout/ReportCard/` — cards de relatórios ESG
- `commerce/PDPRichContent/` (+ `parseRichContent`) — conteúdo rico da PDP
- `commerce/SkuSelector/` (+ `SkuSwapModal`, `useSkuSelector`) — seletor de SKU específico
- `commerce/ProductInfo/Details/BathtubSkuSelector/` (+ `BathtubControlRow`, `useBathtubSkuSelector`, `useIsBathtub`) — lógica de banheiras
- `commerce/ProductInfo/Details/IncludedItems/`
- `commerce/ProductAccordion/Guides/`, `TechnicalInfo/` (+ `Measurements`, `parseDimensions`) — reescritos como `Measurements/` e `SpecificationGroupTable/` genéricos
- `commerce/ProductInfo/Details/AttachmentSelector/` — **adicionado** como substituto genérico
- `ui/Icons/`: `AwardIcon`, `InvestmentIcon`, `PeopleIcon`, `ReductionIcon` (ícones do ESG)

**Schemas de CMS**

- `cms_component__EsgJourney.jsonc`
- `cms_component__InstitutionalBanner.jsonc`
- `cms_component__PDPRichContent.jsonc`

**Arquivos soltos na raiz**

- `PR_DESCRIPTION.md`, `crosselling.ts`

**Simplificado (não removido)**

- Resolvers `vtex/`: `crossSelling`, `product`, `contact` — tiraram-se campos e specs hardcoded do cliente
- `utils/`: `skuAttachments`, `skuVariants`, `events`
- `ModelQuickFilter`, `Filters`, `ProductGrid.constants` — desacoplados de categorias fixas
- `types/faststore-custom.ts`

## O que ficou

- **44 componentes** em `ui/` (21), `commerce/` (15), `layout/` (6), `providers/` (2)
- **19 sections de CMS** + 1 exemplo
- Toda a infra: `discovery.config.js`, tema (`custom-theme.scss`), fragments, `sdk/`, `graphql/`, hooks, `.claude/` (skills e docs)
