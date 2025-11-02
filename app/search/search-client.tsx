"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { Album, AlbumsData } from "@/lib/types"
import { motion } from "framer-motion"
import { ArrowLeft, Search } from "lucide-react"
import Image from "next/image"
import { DarkModeToggle } from "@/components/dark-mode-toggle"

export function SearchPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(query)
  const [showSearchInput, setShowSearchInput] = useState(false)

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

  const filteredAlbums = useMemo(() => {
    if (!query.trim()) return albums

    const searchQuery = query.toLowerCase()
    return albums.filter(
      (album) =>
        album.title.toLowerCase().includes(searchQuery) ||
        album.subtitle.toLowerCase().includes(searchQuery) ||
        album.description?.toLowerCase().includes(searchQuery) ||
        album.searchTags?.some((tag) => tag.toLowerCase().includes(searchQuery)),
    )
  }, [albums, query])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearchInput(false)
    }
  }

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {showSearchInput && (
        <motion.form
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          onSubmit={handleSearchSubmit}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl px-6"
        >
          <div className="relative bg-background/90 backdrop-blur-md border border-border rounded-full shadow-lg p-4">
            <input
              type="text"
              placeholder="Search albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-4 pr-12 py-2 rounded-full bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
        </motion.form>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={24} />
            <span>Back</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSearchInput(!showSearchInput)}
            className={`fixed top-4 right-18 z-50 p-2 rounded-lg bg-muted hover:bg-accent transition-colors border border-border`}
            aria-label="Search album"
          >
            <Search size={20} className="text-foreground" />
          </motion.button>
          <DarkModeToggle position="static" />
        </div>
      </div>

      {/* Search Results */}
      <div className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-bold mb-2 text-foreground">Search Results</h1>
            <p className="text-muted-foreground mb-12">
              Found {filteredAlbums.length} album{filteredAlbums.length !== 1 ? "s" : ""} for "{query}"
            </p>
          </motion.div>

          {filteredAlbums.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <p className="text-muted-foreground text-lg">No albums found matching your search.</p>
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
                    router.push(`/collection/${album.collection?.toLowerCase()}/album?id=${album.id}`)
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
                      <p className="text-sm text-white/80">{album.subtitle}</p>
                      <div className="mt-4 text-xs font-medium text-white/70">{album.pages.length} pages</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
