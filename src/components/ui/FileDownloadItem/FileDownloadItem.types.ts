export interface FileDownloadItemProps {
  /** Texto exibido à esquerda (ex.: "Manual", "Logotipo") */
  label: string
  /** Arquivo baixado ao clicar em "Download" */
  fileUrl?: string
  /** Classe extra aplicada ao wrapper, para customizar espaçamento/borda por contexto de uso */
  className?: string
}
