export interface InstitutionalPageHighlight {
  /** Título do bloco de destaque (ex.: "Fale Conosco") */
  title?: string
  /** Texto (rich text) do bloco */
  text?: string
  /** Texto exibido no botão */
  buttonLabel?: string
  /** Link do botão */
  buttonHref?: string
  /** Estilo em card (fundo, sombra). Se `false`, usa linhas divisórias */
  cardStyle?: boolean
}

export type InstitutionalPageContactMethodIcon = 'phone' | 'email'

export interface InstitutionalPageContactMethod {
  /** Ícone padrão (ignorado se `customIconUrl` for informado) */
  icon?: InstitutionalPageContactMethodIcon
  /** Ícone personalizado */
  customIconUrl?: string
  /** Texto exibido (ex.: telefone ou e-mail) */
  label: string
  /** Link opcional (ex.: `tel:...`, `mailto:...`) */
  href?: string
}

export interface InstitutionalPageFaqItem {
  /** Pergunta exibida no cabeçalho do item */
  question: string
  /** Resposta (rich text) exibida quando o item estiver expandido */
  answer: string
}

export interface InstitutionalPageFile {
  /** Texto exibido à esquerda (ex.: "Manual", "Logotipo") */
  label: string
  /** Arquivo baixado ao clicar em "Download" */
  fileUrl?: string
}

export interface InstitutionalPageBanner {
  /** URL da imagem do banner */
  imageUrl?: string
  /** Texto alternativo da imagem */
  alt?: string
}

export interface InstitutionalPageVideoBlock {
  type: 'video'
  /** Título exibido na faixa superior do vídeo */
  videoTitle: string
  /** Imagem de fundo exibida antes do play */
  videoThumbnailUrl?: string
  /** URL do vídeo reproduzido ao clicar no play */
  videoUrl?: string
  /** Logo sobreposta no canto inferior direito do vídeo */
  videoLogoUrl?: string
}

export interface InstitutionalPageFilesBlock {
  type: 'files'
  /** Título do bloco (ex.: "Manual da marca") */
  filesTitle?: string
  /** Texto descritivo do bloco */
  filesDescription?: string
  /** Lista de arquivos para download (ex.: "Manual", "Logotipo") */
  filesItems?: InstitutionalPageFile[]
}

export interface InstitutionalPageFaqBlock {
  type: 'faq'
  /** Lista de perguntas e respostas do accordion */
  faqItems?: InstitutionalPageFaqItem[]
}

export interface InstitutionalPageContactBlock {
  type: 'contact'
  /** Exibe o formulário de contato */
  contactShowForm?: boolean
  /** E-mail que recebe as mensagens enviadas pelo formulário de contato */
  contactRecipientEmail?: string
  /** Texto exibido acima da lista de contatos alternativos (ex.: "Ou se preferir...") */
  contactMethodsTitle?: string
  /** Lista de contatos alternativos (ex.: telefone, e-mail) */
  contactMethods?: InstitutionalPageContactMethod[]
}

export interface InstitutionalPageLocation {
  /** Nome do local (ex.: "Loja Centro") */
  name: string
  /** Imagem de capa do local */
  imageUrl?: string
  /** Endereço completo */
  address?: string
  /** Telefone exibido */
  phone?: string
  /** Link do telefone (ex.: `tel:...`) */
  phoneHref?: string
  /** Horário de funcionamento */
  hours?: string
  /** Link do Google Maps usado no botão "Como chegar" */
  mapsUrl?: string
}

export interface InstitutionalPageLocationsBlock {
  type: 'locations'
  /** Lista de unidades/locais exibidos em cards */
  locationsItems?: InstitutionalPageLocation[]
  /** Ícone personalizado do endereço, exibido no lugar do ícone padrão */
  locationsPinIconUrl?: string
  /** Ícone personalizado do telefone, exibido no lugar do ícone padrão */
  locationsPhoneIconUrl?: string
  /** Ícone personalizado do horário, exibido no lugar do ícone padrão */
  locationsClockIconUrl?: string
  /** Ícone personalizado do botão "Como chegar", exibido no lugar do ícone padrão */
  locationsDirectionsIconUrl?: string
}

export interface InstitutionalPageHighlightBlock {
  type: 'highlight'
  /** Título do bloco de destaque (ex.: "Fale Conosco") */
  highlightTitle: string
  /** Texto (rich text) do bloco */
  highlightText: string
  /** Texto exibido no botão */
  highlightButtonLabel: string
  /** Link do botão */
  highlightButtonHref: string
  /** Estilo em card (fundo, sombra). Se `false`, usa linhas divisórias */
  highlightCardStyle?: boolean
}

export type InstitutionalPageBlock =
  | InstitutionalPageVideoBlock
  | InstitutionalPageFilesBlock
  | InstitutionalPageFaqBlock
  | InstitutionalPageContactBlock
  | InstitutionalPageLocationsBlock
  | InstitutionalPageHighlightBlock

export interface InstitutionalPageItem {
  /** Texto exibido no menu (ex.: "Políticas de Privacidade") */
  label: string
  /** Banner opcional exibido no topo da página quando este item estiver selecionado */
  banner?: InstitutionalPageBanner
  /** Conteúdo (rich text) exibido quando este item estiver selecionado */
  content: string
  /** Blocos de conteúdo escolhidos pelo editor, na ordem em que aparecem na página */
  blocks?: InstitutionalPageBlock[]
}

export interface InstitutionalPageGroup {
  /** Título do grupo no menu (ex.: "Institucional") */
  title: string
  /** Itens do grupo */
  items: InstitutionalPageItem[]
}

export interface InstitutionalPageProps {
  /** Grupos de navegação exibidos na lateral */
  groups: InstitutionalPageGroup[]
}
