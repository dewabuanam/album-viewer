export interface PageContent {
  id: string
  template:
    | "cover"
    | "single-image"
    | "grid-3"
    | "grid-4"
    | "grid-2-square"
    | "grid-2-rect"
    | "text-image"
    | "quote"
    | "full-image"
    | "full-image-2"
    | "full-image-4"
    | "full-image-6"
    | "full-image-8"
    | "full-image-10"
    | "full-image-12"
    | "full-image-16"
    | "full-image-2-text"
    | "full-image-4-text"
    | "full-image-6-text"
    | "full-image-8-text"
    | "full-image-10-text"
    | "full-image-12-text"
    | "full-image-16-text"
    | "full-image-4-grid"
    | "full-image-8-grid"
    | "full-image-16-grid"
    | "two-column"
    | "collage"
    | "video"
    | "video-gallery"
    | "grid-2-with-text"
    | "grid-4-alt"
    | "grid-6"
    | "grid-8"
    | "grid-10"
    | "grid-12"
    | "grid-16"
  title?: string
  subtitle?: string
  description?: string
  image?: string
  images?: string[]
  backgroundImage?: string
  imagePosition?: "left" | "right" | "full"
  textColor?: string
  author?: string
  quote?: string
  layout?: "vertical" | "horizontal"
  backgroundColor?: string
  minioBucket?: string
  videoUrl?: string
  videoPoster?: string
  videos?: Array<{ url: string; title?: string; poster?: string }>
  textAnimation?: "fade" | "slide" | "bounce" | "none"
  animationDelay?: number
  titleFont?: "roboto" | "playfair" | "poppins" | "lora"
  textFont?: "roboto" | "playfair" | "poppins" | "lora"
}

export interface Album {
  id: string
  title: string
  subtitle: string
  description?: string
  coverImage: string
  hoverImage?: string
  pages: PageContent[]
  minioBucket?: string
  searchTags?: string[]
  collection?: string
  music?: Array<{ title: string; url: string }> | { title: string; url: string }
}

export interface Collection {
  id: string
  name: string
  description: string
  icon?: string
  albums: Album[]
}

export interface AlbumsData {
  albums: Album[]
}
