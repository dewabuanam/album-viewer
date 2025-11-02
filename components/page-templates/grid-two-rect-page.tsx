"use client"

import type { PageContent } from "@/lib/types"
import { motion } from "framer-motion"
import { MediaLoader } from "../media-loader"
import { useState } from "react"
import { FullscreenImageViewer } from "../fullscreen-image-viewer"

interface GridTwoRectPageProps {
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

export function GridTwoRectPage({ content }: GridTwoRectPageProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const images = content.images || []
  const animationType = content.textAnimation || "fade"
  const titleFontClass = getFontClass(content.titleFont)
  const textFontClass = getFontClass(content.textFont)

  const textVariants = {
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    slide: { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } },
    bounce: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
  }

  return (
    <>
      <div className="w-full h-full p-4 sm:p-8 md:p-12 flex flex-col justify-center">
        {/* Title */}
        {content.title && (
          <motion.h2
            variants={textVariants[animationType as keyof typeof textVariants]}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6 }}
            className={`text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-8 ${titleFontClass}`}
          >
            {content.title}
          </motion.h2>
        )}

        {/* Two Rectangle Images (stacked) */}
        <div className="flex flex-col gap-3 sm:gap-6 flex-1">
          {images.slice(0, 2).map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.08 }}
              className="relative h-24 sm:h-32 md:h-40 rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
              onClick={() => setFullscreenImage(image)}
            >
              <MediaLoader src={image} alt={`Image ${index + 1}`} fill className="object-cover" />
            </motion.div>
          ))}
        </div>

        {/* Description */}
        {content.description && (
          <motion.p
            variants={textVariants[animationType as keyof typeof textVariants]}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-muted-foreground mt-4 sm:mt-8 text-sm leading-relaxed ${textFontClass}`}
          >
            {content.description}
          </motion.p>
        )}
      </div>

      <FullscreenImageViewer
        isOpen={!!fullscreenImage}
        imageUrl={fullscreenImage || ""}
        onClose={() => setFullscreenImage(null)}
      />
    </>
  )
}
