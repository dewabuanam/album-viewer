"use client"

import type { Album } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"

interface BookSelectorProps {
  albums: Album[]
  selectedAlbumId: string
  onSelectAlbum: (albumId: string) => void
}

export function BookSelector({ albums, selectedAlbumId, onSelectAlbum }: BookSelectorProps) {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 p-6 overflow-y-auto">
      <h2 className="text-white text-xl font-serif mb-8">Albums</h2>
      <div className="space-y-4">
        {albums.map((album) => (
          <motion.button
            key={album.id}
            onClick={() => onSelectAlbum(album.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
              selectedAlbumId === album.id
                ? "bg-amber-600 text-white shadow-lg"
                : "bg-slate-700 text-slate-200 hover:bg-slate-600"
            }`}
          >
            <div className="relative w-full h-32 mb-3 rounded overflow-hidden">
              <Image src={album.coverImage || "/placeholder.svg"} alt={album.title} fill className="object-cover" />
            </div>
            <h3 className="font-serif font-bold text-sm">{album.title}</h3>
            <p className="text-xs opacity-75">{album.subtitle}</p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
