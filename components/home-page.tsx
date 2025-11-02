"use client"

import type React from "react"

import { useState, useMemo } from "react"
import type { Album } from "@/lib/types"
import { motion } from "framer-motion"
import { Search, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Footer } from "./footer"
import { DarkModeToggle } from "./dark-mode-toggle"

interface HomePageProps {
  albums: Album[]
  onSelectAlbum: (albumId: string) => void
}

export function HomePage({ albums, onSelectAlbum }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const router = useRouter()

  const collections = useMemo(() => {
    const grouped: Record<string, Album[]> = {}
    albums.forEach((album) => {
      const collection = album.collection || "Other"
      if (!grouped[collection]) {
        grouped[collection] = []
      }
      grouped[collection].push(album)
    })
    return grouped
  }, [albums])

  const highlights = ["Family", "Friends", "Hobby"]
  const highlightAlbums = useMemo(() => {
    return highlights.map((highlight) => collections[highlight] || [])
  }, [collections])

  const nextHighlight = () => {
    setHighlightIndex((prev) => (prev + 1) % highlights.length)
  }

  const prevHighlight = () => {
    setHighlightIndex((prev) => (prev - 1 + highlights.length) % highlights.length)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearchInput(false)
      setSearchQuery("")
    }
  }

  return (
    <div className="w-full bg-background">
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
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

      {/* Hero Section */}
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <Image src="/life.webp" alt="My Personal Life" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white max-w-3xl px-6"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold mb-4"
          >
            My Personal Life
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl md:text-4xl font-light mb-6 text-white/90"
          >
            Family, Friends & Hobbies
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/80 leading-relaxed"
          >
            I am Dewa Muharmadin. Beyond my professional life, I enjoy spending time with family and friends, exploring
            new places, trying new food, and pursuing various hobbies. I believe in maintaining a healthy work-life
            balance and finding joy in the simple things.
          </motion.p>
        </motion.div>
      </div>

      <div className="relative w-full h-screen bg-background flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        {highlightAlbums[highlightIndex]?.[0] && (
          <Image
            src={
              highlightAlbums[highlightIndex][0].hoverImage ||
              highlightAlbums[highlightIndex][0].coverImage ||
              "/placeholder.svg" ||
              "/placeholder.svg" ||
              "/placeholder.svg" ||
              "/placeholder.svg" ||
              "/placeholder.svg" ||
              "/placeholder.svg"
            }
            alt={highlights[highlightIndex]}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />

        {/* Navigation Buttons */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevHighlight}
          className="absolute left-8 z-20 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all"
        >
          <ChevronLeft size={24} className="text-white" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextHighlight}
          className="absolute right-8 z-20 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all"
        >
          <ChevronRight size={24} className="text-white" />
        </motion.button>

        {/* Center Content */}
        <motion.div
          key={highlightIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center text-white max-w-2xl px-6"
        >
          <h2 className="text-6xl md:text-7xl font-bold mb-4">{highlights[highlightIndex]}</h2>
          <p className="text-lg md:text-xl text-white/80 mb-8">
            {highlightAlbums[highlightIndex]?.[0]?.description || "Explore our collection"}
          </p>

          {/* Glass Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/collection/${highlights[highlightIndex].toLowerCase()}`)}
            className="px-8 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium hover:bg-white/30 transition-all duration-300"
          >
            View Albums
          </motion.button>
        </motion.div>

        {/* Indicator Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {highlights.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setHighlightIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === highlightIndex ? "bg-white w-8" : "bg-white/50"
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>

      <div className="px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-0 w-screen relative left-1/2 right-1/2 -mx-[50vw]">
            {Object.entries(collections)
              .filter(([collectionName]) => !["Family", "Friends", "Hobby"].includes(collectionName))
              .map(([collectionName, collectionAlbums], idx) => (
                <motion.div
                  key={collectionName}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group cursor-pointer relative h-96 overflow-hidden"
                >
                  <Image
                    src={collectionAlbums[0]?.hoverImage || collectionAlbums[0]?.coverImage || "/placeholder.svg"}
                    alt={collectionName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
                    <h3 className="text-3xl md:text-4xl font-bold mb-3">{collectionName}</h3>
                    <p className="text-sm md:text-base text-white/80 mb-6 line-clamp-2">
                      {collectionAlbums[0]?.description || "Explore our collection"}
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push(`/collection/${collectionName.toLowerCase()}`)}
                      className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium hover:bg-white/30 transition-all duration-300"
                    >
                      View Albums
                    </motion.button>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
