import { Image } from 'src/components/ui/Image'
import type { MediaProps } from './Media.types'

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov']

function inferMediaType(src: string): 'image' | 'video' {
  const [pathname] = src.toLowerCase().split(/[?#]/)

  return VIDEO_EXTENSIONS.some((extension) => pathname.endsWith(extension))
    ? 'video'
    : 'image'
}

function Media({
  src,
  alt,
  type,
  className,
  autoPlay = true,
  loop = true,
  muted = true,
  poster,
}: MediaProps) {
  const resolvedType = type ?? inferMediaType(src)

  if (resolvedType === 'video') {
    return (
      <video
        className={className}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        aria-label={alt}
      />
    )
  }

  return (
    <Image className={className} src={src} alt={alt} width={661} height={647} />
  )
}

export default Media
