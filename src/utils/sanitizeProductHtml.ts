/**
 * A `description` do catálogo VTEX vem como HTML cru (`<br />`, `<b>`, `<p>`),
 * e não como o rich text serializado do CMS — passá-la pelo `renderRichText`
 * cairia no fallback de texto puro e escaparia as tags, exibindo `<br />`
 * literal na tela.
 *
 * Como o valor termina em `dangerouslySetInnerHTML`, o HTML é reduzido a uma
 * allowlist de tags de formatação: qualquer outra tag é descartada (mantendo o
 * texto interno) e todos os atributos são removidos, exceto `href`/`title` em
 * âncoras. Isso elimina `script`, `style`, `iframe`, handlers `on*` e URLs
 * `javascript:` que possam ter sido colados no editor do catálogo.
 */

const ALLOWED_TAGS = new Set([
  'b',
  'strong',
  'i',
  'em',
  'u',
  's',
  'br',
  'p',
  'ul',
  'ol',
  'li',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'span',
  'div',
  'a',
])

/** Tags cujo conteúdo interno também deve ser descartado, não só a tag. */
const STRIPPED_CONTENT_TAGS = ['script', 'style', 'iframe', 'noscript']

const SAFE_HREF = /^(https?:|mailto:|tel:|\/|#)/i

function sanitizeAnchorAttributes(attributes: string): string {
  const href = /\shref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(attributes)
  const title = /\stitle\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(
    attributes
  )

  const hrefValue = href ? (href[2] ?? href[3] ?? href[4] ?? '').trim() : ''
  const titleValue = title
    ? (title[2] ?? title[3] ?? title[4] ?? '').trim()
    : ''

  let result = ''

  if (hrefValue && SAFE_HREF.test(hrefValue)) {
    result += ` href="${hrefValue.replace(/"/g, '&quot;')}"`
  }

  if (titleValue) {
    result += ` title="${titleValue.replace(/"/g, '&quot;')}"`
  }

  return result
}

export function sanitizeProductHtml(html?: string | null): string {
  if (!html) {
    return ''
  }

  let output = html

  for (const tag of STRIPPED_CONTENT_TAGS) {
    output = output.replace(
      new RegExp(`<${tag}\\b[\\s\\S]*?(</${tag}\\s*>|$)`, 'gi'),
      ''
    )
  }

  output = output.replace(/<!--[\s\S]*?-->/g, '')

  return output.replace(
    /<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|'[^']*'|[^>])*)>/g,
    (_match, closing: string, tagName: string, attributes: string) => {
      const tag = tagName.toLowerCase()

      if (!ALLOWED_TAGS.has(tag)) {
        return ''
      }

      if (closing) {
        return `</${tag}>`
      }

      if (tag === 'br') {
        return '<br />'
      }

      if (tag === 'a') {
        return `<a${sanitizeAnchorAttributes(attributes)}>`
      }

      return `<${tag}>`
    }
  )
}

/** Há texto visível depois de remover as tags? */
export function hasVisibleHtmlContent(html: string): boolean {
  return html.replace(/<[^>]*>/g, '').trim().length > 0
}
