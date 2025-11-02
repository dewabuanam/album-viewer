"use client"

import { useState } from "react"
import type { PageContent } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { FullscreenImageViewer } from "../fullscreen-image-viewer"
import { highlightText } from "@/lib/highlight-utils"

interface CoverPageProps {
  content: PageContent
  highlightedText?: string
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

export function CoverPage({ content, highlightedText }: CoverPageProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const titleFontClass = getFontClass(content.titleFont)
  const textFontClass = getFontClass(content.textFont)

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="w-full h-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-full overflow-hidden bg-black cursor-pointer group"
          onClick={() => content.backgroundImage && setFullscreenImage(content.backgroundImage)}
        >
          {content.backgroundImage && (
            <Image src={content.backgroundImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-8"
          >
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-4 ${titleFontClass}`}
              style={{ color: content.textColor || "white" }}
            >
              {highlightedText ? highlightText(content.title || "", highlightedText) : content.title}
            </h1>
            {content.subtitle && (
              <p
                className={`text-lg sm:text-xl md:text-2xl font-light ${textFontClass}`}
                style={{ color: content.textColor || "white" }}
              >
                {highlightedText ? highlightText(content.subtitle, highlightedText) : content.subtitle}
              </p>
            )}
          </motion.div>
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
