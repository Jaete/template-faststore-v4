/**
 * Converte o rich text serializado do CMS em HTML percorrendo o JSON
 * diretamente, sem montar um editor Lexical nem depender de DOM — por isso
 * funciona igual no SSR e no browser (o pipeline anterior, via
 * `$generateHtmlFromNodes`, lança erro em ambiente sem DOM e derrubava o
 * conteúdo no HTML servido).
 *
 * Formatos aceitos:
 * - Estado serializado do Lexical (`{ root: ... }`) — caminho principal
 * - Raw do Draft.js (`{ blocks: ... }`) — fallback que preserva o texto
 * - String não-JSON — tratada como texto puro (escapado)
 */

interface SerializedNode {
  type?: string
  text?: string
  /** Em text nodes é bitmask numérico; em blocos é o alinhamento (string) */
  format?: number | string
  style?: string
  tag?: string
  url?: string
  target?: string
  rel?: string
  title?: string
  listType?: string
  start?: number
  indent?: number
  src?: string
  altText?: string
  headerState?: number
  children?: SerializedNode[]
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Bitmask de formatação dos text nodes do Lexical
const TEXT_FORMAT_TAGS: Array<[number, string]> = [
  [1, 'strong'], // bold
  [2, 'em'], // italic
  [4, 's'], // strikethrough
  [8, 'u'], // underline
  [16, 'code'],
  [32, 'sub'], // subscript
  [64, 'sup'], // superscript
  [128, 'mark'], // highlight
]

const BLOCK_ALIGNMENTS = new Set([
  'left',
  'center',
  'right',
  'justify',
  'start',
  'end',
])

// Mesmo passo de indentação usado pelo tema padrão do Lexical
const INDENT_STEP_PX = 40

function renderTextNode(node: SerializedNode): string {
  let html = escapeHtml(node.text ?? '')
  const format = typeof node.format === 'number' ? node.format : 0

  for (const [bit, tag] of TEXT_FORMAT_TAGS) {
    if (format & bit) {
      html = `<${tag}>${html}</${tag}>`
    }
  }

  // Estilo inline autorado no editor (cor, tamanho de fonte etc.)
  if (node.style) {
    html = `<span style="${escapeHtml(node.style)}">${html}</span>`
  }

  return html
}

/** Atributo style de blocos: alinhamento + indentação, quando presentes */
function blockStyleAttr(node: SerializedNode): string {
  const styles: string[] = []

  if (typeof node.format === 'string' && BLOCK_ALIGNMENTS.has(node.format)) {
    styles.push(`text-align: ${node.format}`)
  }

  if (typeof node.indent === 'number' && node.indent > 0) {
    styles.push(`padding-inline-start: ${node.indent * INDENT_STEP_PX}px`)
  }

  return styles.length > 0 ? ` style="${styles.join('; ')}"` : ''
}

function renderChildren(node: SerializedNode): string {
  return (node.children ?? []).map(renderNode).join('')
}

function renderLink(node: SerializedNode): string {
  let attrs = ` href="${escapeHtml(node.url ?? '#')}"`

  if (node.target) {
    attrs += ` target="${escapeHtml(node.target)}"`
    // target="_blank" sem noopener é vetor de tabnabbing
    if (node.target === '_blank' && !node.rel?.includes('noopener')) {
      attrs += ` rel="${escapeHtml(node.rel ? `${node.rel} noopener` : 'noopener')}"`
    } else if (node.rel) {
      attrs += ` rel="${escapeHtml(node.rel)}"`
    }
  } else if (node.rel) {
    attrs += ` rel="${escapeHtml(node.rel)}"`
  }

  if (node.title) {
    attrs += ` title="${escapeHtml(node.title)}"`
  }

  return `<a${attrs}>${renderChildren(node)}</a>`
}

function renderNode(node: SerializedNode): string {
  switch (node.type) {
    case 'text':
    case 'code-highlight':
      return renderTextNode(node)
    case 'linebreak':
      return '<br>'
    case 'tab':
      return '\t'
    case 'paragraph':
      return `<p${blockStyleAttr(node)}>${renderChildren(node)}</p>`
    case 'heading': {
      const tag = /^h[1-6]$/.test(node.tag ?? '') ? node.tag : 'p'
      return `<${tag}${blockStyleAttr(node)}>${renderChildren(node)}</${tag}>`
    }
    case 'quote':
      return `<blockquote${blockStyleAttr(node)}>${renderChildren(node)}</blockquote>`
    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      const start =
        tag === 'ol' && typeof node.start === 'number' && node.start > 1
          ? ` start="${node.start}"`
          : ''
      return `<${tag}${start}>${renderChildren(node)}</${tag}>`
    }
    case 'listitem':
      return `<li${blockStyleAttr(node)}>${renderChildren(node)}</li>`
    case 'link':
    case 'autolink':
      return renderLink(node)
    case 'code':
      return `<pre><code>${renderChildren(node)}</code></pre>`
    case 'horizontalrule':
      return '<hr>'
    case 'image':
    case 'inline-image':
      return node.src
        ? `<img src="${escapeHtml(node.src)}" alt="${escapeHtml(node.altText ?? '')}">`
        : ''
    case 'table':
      return `<table>${renderChildren(node)}</table>`
    case 'tablerow':
      return `<tr>${renderChildren(node)}</tr>`
    case 'tablecell': {
      // headerState > 0 indica célula de cabeçalho (linha e/ou coluna)
      const tag = (node.headerState ?? 0) > 0 ? 'th' : 'td'
      return `<${tag}>${renderChildren(node)}</${tag}>`
    }
    default:
      // Tipo desconhecido: preserva o conteúdo dos filhos em vez de sumir
      return renderChildren(node)
  }
}

export function renderRichText(content?: string): string | null {
  if (!content) {
    return null
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(content)
  } catch {
    // Conteúdo cadastrado como texto puro, não como rich text serializado
    return escapeHtml(content)
  }

  const state = parsed as {
    root?: SerializedNode
    blocks?: Array<{ text?: string }>
  }

  if (state?.root) {
    return renderNode(state.root)
  }

  if (Array.isArray(state?.blocks)) {
    return state.blocks
      .map((block) => `<p>${escapeHtml(block.text ?? '')}</p>`)
      .join('')
  }

  return null
}

/**
 * Um campo de rich text "vazio" no CMS ainda serializa um documento válido
 * (ex.: `{"root":{"children":[{"type":"paragraph","children":[]}]}}`), então
 * `renderRichText` devolve uma string não-vazia (`<p></p>`) mesmo sem texto
 * nenhum digitado. Usar essa função para decidir se um bloco deve renderizar.
 */
export function hasVisibleContent(html: string | null): boolean {
  if (!html) {
    return false
  }

  return html.replace(/<[^>]*>/g, '').trim().length > 0
}
