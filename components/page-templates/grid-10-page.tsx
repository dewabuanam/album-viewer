"use client"

import { useState } from "react"
import type { PageContent } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { MediaLoader } from "../media-loader"
import { FullscreenImageViewer } from "../fullscreen-image-viewer"

interface Grid10PageProps {
  content: PageContent
}

export function Grid10Page({ content }: Grid10PageProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const images = content.images || []
  const useMinIO = images.some((img) => img.includes("/") && !img.startsWith("http"))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
        className="w-full h-full flex flex-col p-4 sm:p-8 md:p-12 bg-white overflow-y-auto"
      >
        <motion.div variants={containerVariants} className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-5 flex-1">
          {images.slice(0, 10).map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.08 }}
              className="relative h-14 sm:h-20 md:h-28 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setFullscreenImage(image)}
            >
              {useMinIO && image.includes("/") && !image.startsWith("http") ? (
                <MediaLoader
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  bucketName={content.minioBucket || "albums"}
                  fill
                  className="object-cover"
                />
              ) : (
                <Image src={image || "/placeholder.svg"} alt={`Gallery ${index + 1}`} fill className="object-cover" />
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
