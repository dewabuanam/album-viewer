"use client"

import { useState } from "react"
import type { PageContent } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { MediaLoader } from "../media-loader"
import { FullscreenImageViewer } from "../fullscreen-image-viewer"

interface SingleImagePageProps {
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

export function SingleImagePage({ content }: SingleImagePageProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const isFullWidth = content.imagePosition === "full"
  const useMinIO = content.image?.includes("/") && !content.image?.startsWith("http")
  const titleFontClass = getFontClass(content.titleFont)
  const textFontClass = getFontClass(content.textFont)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`w-full h-full flex ${
          isFullWidth ? "flex-col" : "flex-col md:flex-row"
        } items-center justify-center gap-4 sm:gap-8 p-4 sm:p-8 md:p-12 bg-white`}
      >
        {content.imagePosition === "left" && (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex-1 relative h-48 sm:h-64 md:h-96 w-full cursor-pointer group rounded-lg overflow-hidden"
            onClick={() => content.image && setFullscreenImage(content.image)}
          >
            <div className="w-full h-full group-hover:scale-110 transition-transform duration-300">
              {useMinIO ? (
                <MediaLoader
                  src={content.image || ""}
                  alt={content.title || ""}
                  bucketName={content.minioBucket || "albums"}
                  fill
                  className="rounded-lg"
                />
              ) : (
                <Image src={content.image || ""} alt={content.title || ""} fill className="object-cover rounded-lg" />
              )}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={isFullWidth ? "w-full" : "flex-1 w-full"}
        >
          {content.title && (
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-slate-900 ${titleFontClass}`}>
              {content.title}
            </h2>
          )}
          {content.description && (
            <p className={`text-base sm:text-lg text-slate-700 leading-relaxed ${textFontClass}`}>
              {content.description}
            </p>
          )}
        </motion.div>

        {content.imagePosition === "right" && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex-1 relative h-48 sm:h-64 md:h-96 w-full cursor-pointer group rounded-lg overflow-hidden"
            onClick={() => content.image && setFullscreenImage(content.image)}
          >
            <div className="w-full h-full group-hover:scale-110 transition-transform duration-300">
              {useMinIO ? (
                <MediaLoader
                  src={content.image || ""}
                  alt={content.title || ""}
                  bucketName={content.minioBucket || "albums"}
                  fill
                  className="rounded-lg"
                />
              ) : (
                <Image src={content.image || ""} alt={content.title || ""} fill className="object-cover rounded-lg" />
              )}
            </div>
          </motion.div>
        )}

        {isFullWidth && content.image && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full relative h-48 sm:h-64 md:h-96 cursor-pointer group rounded-lg overflow-hidden"
            onClick={() => setFullscreenImage(content.image || null)}
          >
            <div className="w-full h-full group-hover:scale-110 transition-transform duration-300">
              {useMinIO ? (
                <MediaLoader
                  src={content.image}
                  alt={content.title || ""}
                  bucketName={content.minioBucket || "albums"}
                  fill
                  className="rounded-lg"
                />
              ) : (
                <Image
                  src={content.image || "/placeholder.svg"}
                  alt={content.title || ""}
                  fill
                  className="object-cover rounded-lg"
                />
              )}
            </div>
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
