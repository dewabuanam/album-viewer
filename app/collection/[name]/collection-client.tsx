"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import type { Album, AlbumsData } from "@/lib/types"
import { motion } from "framer-motion"
import { ArrowLeft, Search } from "lucide-react"
import Image from "next/image"
import { DarkModeToggle } from "@/components/dark-mode-toggle"

interface CollectionPageClientProps {
  name: string
}

export function CollectionPageClient({ name }: CollectionPageClientProps) {
  const router = useRouter()
  const collectionName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch("/albums-data.json")
        const data: AlbumsData = await response.json()
        setAlbums(data.albums)
      } catch (error) {
        console.error("Failed to load albums:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAlbums()
  }, [])

  const collectionAlbums = useMemo(() => {
    return albums.filter((album) => album.collection?.toLowerCase() === collectionName.toLowerCase())
  }, [albums, collectionName])

  const filteredAlbums = useMemo(() => {
    if (!searchQuery.trim()) return collectionAlbums

    const query = searchQuery.toLowerCase()
    return collectionAlbums.filter(
      (album) =>
        album.title.toLowerCase().includes(query) ||
        album.subtitle.toLowerCase().includes(query) ||
        album.description?.toLowerCase().includes(query) ||
        album.searchTags?.some((tag) => tag.toLowerCase().includes(query)),
    )
  }, [collectionAlbums, searchQuery])

  const heroAlbum = collectionAlbums[0]

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Hero Section with Collection Cover */}
      <div className="relative w-full h-96 flex items-center justify-center overflow-hidden">
        {heroAlbum && (
          <Image
            src={heroAlbum.hoverImage || heroAlbum.coverImage || "/placeholder.svg"}
            alt={collectionName}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />

        {/* Header with Back Button */}
        <div className="absolute top-6 left-6 z-40">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </motion.button>
        </div>

        <div className="absolute top-6 right-6 z-40">
          <DarkModeToggle position="static" />
        </div>

        {/* Collection Title and Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center text-white max-w-3xl px-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{collectionName}</h1>
          <p className="text-lg md:text-xl text-white/90">
            {heroAlbum?.description || "Explore this collection of memories"}
          </p>
        </motion.div>
      </div>

      {/* Albums Grid */}
      <div className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={`Search albums in ${collectionName}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Search
                  size={20}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
              </div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-foreground"
            >
              Albums in {collectionName}
            </motion.h2>

            {filteredAlbums.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  {searchQuery ? "No albums found matching your search." : "No albums found in this collection."}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredAlbums.map((album, index) => (
                  <motion.button
                    key={album.id}
                    onClick={() => {
                      router.push(`/collection/${collectionName.toLowerCase()}/album?id=${album.id}`)
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="text-left group"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-muted aspect-[3/4] shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <Image
                        src={album.coverImage || "/placeholder.svg?height=600&width=450&query=album+cover"}
                        alt={album.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{album.title}</h3>
                        <p className="text-sm text-white/80 mb-4">{album.subtitle}</p>
                        <div className="text-xs font-medium text-white/70">{album.pages.length} pages</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
