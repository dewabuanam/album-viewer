"use client"

import { useState } from "react"
import type { PageContent } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { FullscreenImageViewer } from "../fullscreen-image-viewer"

interface FullImage16PageProps {
  content: PageContent
}

export function FullImage16Page({ content }: FullImage16PageProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const images = content.images || []

  return (
    <>
      <div className="w-full h-full flex gap-0">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="flex-1 h-full cursor-pointer group overflow-hidden"
            onClick={() => images[index] && setFullscreenImage(images[index])}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="relative w-full h-full"
            >
              {images[index] && (
                <Image
                  src={images[index] || "/placeholder.svg"}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>

      <FullscreenImageViewer
        isOpen={!!fullscreenImage}
        imageUrl={fullscreenImage || ""}
        onClose={() => setFullscreenImage(null)}
      />
    </>
  )
}
