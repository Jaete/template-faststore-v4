import { useState } from 'react'

export function getYoutubeEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed${parsed.pathname}`
    }

    if (parsed.pathname.startsWith('/embed/')) {
      return url
    }

    const videoId = parsed.searchParams.get('v')

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  } catch {
    return url
  }
}

export function useVideoBanner() {
  const [isPlaying, setIsPlaying] = useState(false)

  const play = () => setIsPlaying(true)

  return { isPlaying, play }
}
