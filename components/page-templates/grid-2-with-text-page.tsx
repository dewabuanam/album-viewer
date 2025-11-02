"use client"

import { useState } from "react"
import type { PageContent } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { MediaLoader } from "../media-loader"
import { FullscreenImageViewer } from "../fullscreen-image-viewer"

interface Grid2WithTextPageProps {
  content: PageContent
}

function getFontClass(fontName?: string): string {
  switch (fontName) {
    case "playfair":
      return "font-playfair"
    case "poppins":
      return "font-poppins"
    case "lora":
      return "font-lora"
    case "roboto":
    default:
      return "font-roboto"
  }
}

export function Grid2WithTextPage({ content }: Grid2WithTextPageProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const images = content.images || []
  const useMinIO = images.some((img) => img.includes("/") && !img.startsWith("http"))
  const titleFontClass = getFontClass(content.titleFont)
  const textFontClass = getFontClass(content.textFont)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full flex flex-col p-4 sm:p-8 md:p-12 bg-white overflow-y-auto"
      >
        {content.title && (
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-slate-900 ${titleFontClass}`}
          >
            {content.title}
          </motion.h2>
        )}

        {content.description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 ${textFontClass}`}
          >
            {content.description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-4 sm:gap-6 flex-1"
        >
          {images.slice(0, 2).map((image, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="relative h-40 sm:h-56 md:h-72 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setFullscreenImage(image)}
            >
              {useMinIO && image.includes("/") && !image.startsWith("http") ? (
                <MediaLoader
                  src={image}
                  alt={`Image ${index + 1}`}
                  bucketName={content.minioBucket || "albums"}
                  fill
                  className="object-cover"
                />
              ) : (
                <Image src={image || "/placeholder.svg"} alt={`Image ${index + 1}`} fill className="object-cover" />
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
