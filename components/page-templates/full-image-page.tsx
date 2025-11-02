"use client"

import { useState } from "react"
import type { PageContent } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { FullscreenImageViewer } from "../fullscreen-image-viewer"

interface FullImagePageProps {
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

export function FullImagePage({ content }: FullImagePageProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const titleFontClass = getFontClass(content.titleFont)
  const textFontClass = getFontClass(content.textFont)

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="w-full h-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-full overflow-hidden cursor-pointer group"
          onClick={() => content.image && setFullscreenImage(content.image)}
        >
          {content.image && (
            <Image src={content.image || "/placeholder.svg"} alt={content.title || ""} fill className="object-cover" />
          )}

          {/* Overlay with gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          />

          {/* Content overlay */}
          {(content.title || content.description) && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 md:p-12 text-white"
            >
              {content.title && (
                <h2 className={`text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4 ${titleFontClass}`}>
                  {content.title}
                </h2>
              )}
              {content.description && (
                <p className={`text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl ${textFontClass}`}>
                  {content.description}
                </p>
              )}
            </motion.div>
          )}
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
