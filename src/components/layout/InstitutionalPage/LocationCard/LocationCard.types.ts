export interface LocationCardProps {
  /** Nome do local (ex.: "Loja Centro") */
  name: string
  /** Imagem de capa do card */
  imageUrl?: string
  /** Endereço completo */
  address?: string
  /** Telefone exibido */
  phone?: string
  /** Link do telefone (ex.: `tel:...`) */
  phoneHref?: string
  /** Horário de funcionamento */
  hours?: string
  /** Link do Google Maps para o botão "Como chegar" */
  mapsUrl?: string
  /** Ícone personalizado do endereço, exibido no lugar do ícone padrão */
  pinIconUrl?: string
  /** Ícone personalizado do telefone, exibido no lugar do ícone padrão */
  phoneIconUrl?: string
  /** Ícone personalizado do horário, exibido no lugar do ícone padrão */
  clockIconUrl?: string
  /** Ícone personalizado do botão "Como chegar", exibido no lugar do ícone padrão */
  directionsIconUrl?: string
}
