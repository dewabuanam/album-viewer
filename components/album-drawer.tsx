"use client"

import { useState, useMemo } from "react"
import type { Album } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search } from "lucide-react"
import Image from "next/image"

interface AlbumDrawerProps {
  albums: Album[]
  currentAlbumId: string
  isOpen: boolean
  onClose: () => void
  onSelectAlbum: (albumId: string) => void
}

export function AlbumDrawer({
  albums,
  currentAlbumId,
  isOpen,
  onClose,
  onSelectAlbum,
}: AlbumDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAlbums = useMemo(() => {
    if (!searchQuery.trim()) return albums

    const query = searchQuery.toLowerCase()
    return albums.filter(
      (album) =>
        album.title.toLowerCase().includes(query) ||
        album.subtitle.toLowerCase().includes(query) ||
        album.description?.toLowerCase().includes(query),
    )
  }, [albums, searchQuery])

  const handleSelectAlbum = (albumId: string) => {
    onSelectAlbum(albumId)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed left-0 top-0 h-screen w-[90vw] max-w-sm md:w-96 bg-background/90 backdrop-blur-md border-r border-border z-50 flex flex-col overflow-hidden shadow-lg"
          >
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Albums</h2>

              {/* Close button (mobile only) */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors md:hidden"
                title="Close drawer"
              >
                <X size={20} className="text-foreground" />
              </motion.button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search albums..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Album List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredAlbums.length === 0 && (
                <p className="text-sm text-muted-foreground text-center mt-6">
                  No albums found
                </p>
              )}

              {filteredAlbums.map((album, index) => (
                <motion.button
                  key={album.id}
                  onClick={() => handleSelectAlbum(album.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-full text-left rounded-lg overflow-hidden transition-all h-40 relative group ${
                    currentAlbumId === album.id ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image
                    src={
                      album.coverImage ||
                      "/placeholder.svg?height=160&width=320&query=album+cover"
                    }
                    alt={album.title}
                    fill
                    className="object-cover"
                  />

                  {/* Dark overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Text content */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <p className="font-semibold text-white text-sm truncate">
                      {album.title}
                    </p>
                    <p className="text-xs text-white/80 truncate">
                      {album.subtitle}
                    </p>
                    {album.description && (
                      <p className="text-xs text-white/70 line-clamp-1 mt-1">
                        {album.description}
                      </p>
                    )}
                    <p className="text-xs text-white/60 mt-2">
                      {album.pages.length} pages
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
