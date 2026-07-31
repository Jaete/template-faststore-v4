export interface LogoProps {
  /** URL da imagem do logo */
  src: string
  /** Texto alternativo da imagem (e fallback textual quando não houver imagem) */
  alt: string
  /** URL de destino ao clicar no logo (padrão: home) */
  href?: string
}
