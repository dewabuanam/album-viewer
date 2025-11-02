// Utility function to extract YouTube video ID from various URL formats
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null

  // Handle youtube.com/watch?v=VIDEO_ID
  const match1 = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  if (match1) return match1[1]

  // Handle youtube.com/embed/VIDEO_ID
  const match2 = url.match(/youtube\.com\/embed\/([^?&\n]+)/)
  if (match2) return match2[1]

  // If it's just a video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url

  return null
}

// Generate YouTube embed URL
export function getYouTubeEmbedUrl(url: string, muted = false): string | null {
  const videoId = extractYouTubeVideoId(url)
  if (!videoId) return null
  const muteParam = muted ? "&mute=1" : ""
  return `https://www.youtube.com/embed/${videoId}?autoplay=1${muteParam}&controls=0&modestbranding=1&rel=0&fs=0&iv_load_policy=3`
}
