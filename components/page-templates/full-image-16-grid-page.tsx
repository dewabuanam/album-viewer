"use client"

import { useState } from "react"
import type { PageContent } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { MediaLoader } from "../media-loader"
import { FullscreenImageViewer } from "../fullscreen-image-viewer"

interface FullImage16GridPageProps {
  content: PageContent
}

export function FullImage16GridPage({ content }: FullImage16GridPageProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const images = content.images || []
  const useMinIO = images.some((img) => img.includes("/") && !img.startsWith("http"))

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
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full h-full flex flex-col bg-white overflow-hidden"
      >
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-4 gap-0 w-full h-full"
          style={{ gridTemplateRows: "repeat(4, 1fr)" }}
        >
          {images.slice(0, 16).map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="relative w-full h-full cursor-pointer group overflow-hidden"
              onClick={() => setFullscreenImage(image)}
            >
              {useMinIO && image.includes("/") && !image.startsWith("http") ? (
                <MediaLoader
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  bucketName={content.minioBucket || "albums"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Gallery ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <FullscreenImageViewer
        isOpen={!!fullscreenImage}
        imageUrl={fullscreenImage || ""}
        onClose={() => setFullscreenImage(null)}
      />
    </>
  )
}
