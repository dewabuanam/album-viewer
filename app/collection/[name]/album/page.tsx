"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import type { Album, AlbumsData } from "@/lib/types"
import { AlbumViewer } from "@/components/album-viewer"
import { motion } from "framer-motion"

export default function AlbumPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const collectionName = params.name as string
  const albumId = searchParams.get("id")
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)

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

  const selectedAlbum = albums.find((a) => a.id === albumId)

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

  if (!selectedAlbum) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground mb-4">Album not found</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen">
      <AlbumViewer
        album={selectedAlbum}
        albums={albums}
        onBack={() => router.back()}
        onSelectAlbum={(newAlbumId) => {
          router.push(`/collection/${collectionName}/album?id=${newAlbumId}`)
        }}
      />
    </div>
  )
}
