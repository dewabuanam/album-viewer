"use client"

import type { PageContent } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { FullscreenImageViewer } from "../fullscreen-image-viewer"
import { highlightText } from "@/lib/highlight-utils"

interface TextImagePageProps {
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

export function TextImagePage({ content, highlightedText }: TextImagePageProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const isImageLeft = content.imagePosition === "left"
  const titleFontClass = getFontClass(content.titleFont)
  const textFontClass = getFontClass(content.textFont)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full flex flex-col md:flex-row items-center gap-4 sm:gap-8 md:gap-12 p-4 sm:p-8 md:p-12 bg-white"
      >
        {isImageLeft && content.image && (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="flex-1 relative h-48 sm:h-64 md:h-96 w-full cursor-pointer group rounded-lg overflow-hidden"
            onClick={() => setFullscreenImage(content.image || null)}
          >
            <Image src={content.image || "/placeholder.svg"} alt={content.title || ""} fill className="object-cover" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={isImageLeft ? "flex-1 w-full" : "flex-1 w-full"}
        >
          {content.title && (
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-6 text-slate-900 ${titleFontClass}`}>
              {highlightedText ? highlightText(content.title, highlightedText) : content.title}
            </h2>
          )}
          {content.description && (
            <p className={`text-base sm:text-lg text-slate-700 leading-relaxed ${textFontClass}`}>
              {highlightedText ? highlightText(content.description, highlightedText) : content.description}
            </p>
          )}
        </motion.div>

        {!isImageLeft && content.image && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="flex-1 relative h-48 sm:h-64 md:h-96 w-full cursor-pointer group rounded-lg overflow-hidden"
            onClick={() => setFullscreenImage(content.image || null)}
          >
            <Image src={content.image || "/placeholder.svg"} alt={content.title || ""} fill className="object-cover" />
          </motion.div>
        )}
      </motion.div>

      <FullscreenImageViewer
        isOpen={!!fullscreenImage}
        imageUrl={fullscreenImage || ""}
        onClose={() => setFullscreenImage(null)}
      />
    </>
  )
}
