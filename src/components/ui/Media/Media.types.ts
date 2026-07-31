export interface MediaProps {
  src: string
  alt: string
  type?: 'image' | 'video'
  className?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  poster?: string
}
