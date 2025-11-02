"use client"

import type { PageContent } from "@/lib/types"
import { motion } from "framer-motion"
import { useState } from "react"
import { VideoPlayer } from "../video-player"
import { Play } from "lucide-react"
import Image from "next/image"

interface VideoGalleryPageProps {
  content: PageContent
}

export function VideoGalleryPage({ content }: VideoGalleryPageProps) {
  const videos = content.videos || []
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0)
  const selectedVideo = videos[selectedVideoIndex]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full h-full flex flex-col bg-black"
    >
      {/* Main Video Player */}
      <div className="flex-1 relative">
        {selectedVideo && (
          <VideoPlayer
            src={selectedVideo.url}
            poster={selectedVideo.poster}
            title={selectedVideo.title}
            description={content.description}
          />
        )}
      </div>

      {/* Video Thumbnails */}
      {videos.length > 1 && (
        <motion.div variants={containerVariants} className="bg-slate-900 p-4 flex gap-3 overflow-x-auto">
          {videos.map((video, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              onClick={() => setSelectedVideoIndex(index)}
              className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden transition-all ${
                selectedVideoIndex === index ? "ring-2 ring-amber-600" : "opacity-60 hover:opacity-100"
              }`}
            >
              {video.poster && (
                <Image
                  src={video.poster || "/placeholder.svg"}
                  alt={`Video ${index + 1}`}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                <Play size={16} className="text-white fill-white" />
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
