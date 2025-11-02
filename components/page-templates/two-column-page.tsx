"use client"

import type { PageContent } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { FullscreenImageViewer } from "../fullscreen-image-viewer"

interface TwoColumnPageProps {
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

export function TwoColumnPage({ content }: TwoColumnPageProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const images = content.images || []
  const [leftImage, rightImage] = images
  const titleFontClass = getFontClass(content.titleFont)
  const textFontClass = getFontClass(content.textFont)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full flex flex-col md:flex-row gap-3 sm:gap-6 p-4 sm:p-8 bg-white"
      >
        {/* Left Column */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex-1 flex flex-col gap-2 sm:gap-4"
        >
          {leftImage && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-1 relative rounded-lg overflow-hidden cursor-pointer group min-h-32 sm:min-h-48 md:min-h-64"
              onClick={() => setFullscreenImage(leftImage)}
            >
              <Image src={leftImage || "/placeholder.svg"} alt="Left" fill className="object-cover" />
            </motion.div>
          )}
          {content.title && (
            <h3 className={`text-lg sm:text-xl md:text-2xl font-bold text-slate-900 ${titleFontClass}`}>
              {content.title}
            </h3>
          )}
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex-1 flex flex-col gap-2 sm:gap-4"
        >
          {rightImage && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-1 relative rounded-lg overflow-hidden cursor-pointer group min-h-32 sm:min-h-48 md:min-h-64"
              onClick={() => setFullscreenImage(rightImage)}
            >
              <Image src={rightImage || "/placeholder.svg"} alt="Right" fill className="object-cover" />
            </motion.div>
          )}
          {content.description && (
            <p className={`text-base sm:text-lg text-slate-700 leading-relaxed ${textFontClass}`}>
              {content.description}
            </p>
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
