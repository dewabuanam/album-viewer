"use client"

import type { PageContent } from "@/lib/types"
import { motion } from "framer-motion"
import { VideoPlayer } from "../video-player"
import { MediaLoader } from "../media-loader"

interface VideoPageProps {
  content: PageContent
}

export function VideoPage({ content }: VideoPageProps) {
  const useMinIO = content.videoUrl?.includes("/") && !content.videoUrl?.startsWith("http")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full flex flex-col bg-black"
    >
      {useMinIO && content.videoUrl ? (
        <div className="flex-1 relative">
          <MediaLoader
            src={content.videoUrl}
            alt={content.title || "Video"}
            bucketName={content.minioBucket || "albums"}
            fill
          />
        </div>
      ) : (
        <VideoPlayer
          src={content.videoUrl || ""}
          poster={content.videoPoster}
          title={content.title}
          description={content.description}
        />
      )}
    </motion.div>
  )
}
