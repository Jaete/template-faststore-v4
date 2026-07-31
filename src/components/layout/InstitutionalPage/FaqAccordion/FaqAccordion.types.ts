export interface FaqAccordionItem {
  /** Pergunta exibida no cabeçalho do item */
  question: string
  /** Resposta (rich text) exibida quando o item está expandido */
  answer: string
}

export interface FaqAccordionProps {
  /** Itens do accordion, na ordem exibida */
  items: FaqAccordionItem[]
}
