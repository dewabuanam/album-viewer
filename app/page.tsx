"use client"

import { useState, useEffect } from "react"
import type { Album, AlbumsData } from "@/lib/types"
import { HomePage } from "@/components/home-page"
import { AlbumViewer } from "@/components/album-viewer"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"

export default function Home() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"home" | "album">("home")
  const searchParams = useSearchParams()

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

  useEffect(() => {
    const albumId = searchParams.get("albumId")
    if (albumId && albums.length > 0) {
      const album = albums.find((a) => a.id === albumId)
      if (album) {
        setSelectedAlbumId(albumId)
        setView("album")
      }
    }
  }, [searchParams, albums])

  const selectedAlbum = albums.find((a) => a.id === selectedAlbumId)

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="w-screen min-h-screen">
      {view === "home" ? (
        <HomePage
          albums={albums}
          onSelectAlbum={(albumId) => {
            setSelectedAlbumId(albumId)
            setView("album")
          }}
        />
      ) : (
        selectedAlbum && (
          <AlbumViewer
            album={selectedAlbum}
            albums={albums}
            onBack={() => {
              setView("home")
              setSelectedAlbumId("")
            }}
            onSelectAlbum={(albumId) => {
              setSelectedAlbumId(albumId)
            }}
          />
        )
      )}
    </div>
  )
}
