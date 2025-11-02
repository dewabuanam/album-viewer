"use client"

import { useState } from "react"
import type { PageContent } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { MediaLoader } from "../media-loader"
import { FullscreenImageViewer } from "../fullscreen-image-viewer"

interface GridPageProps {
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

export function GridPage({ content }: GridPageProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const columns = content.template === "grid-3" ? 3 : 4
  const images = content.images || []
  const useMinIO = images.some((img) => img.includes("/") && !img.startsWith("http"))
  const titleFontClass = getFontClass(content.titleFont)
  const textFontClass = getFontClass(content.textFont)

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
        className="w-full h-full flex flex-col p-4 sm:p-8 md:p-12 bg-white overflow-y-auto"
      >
        {content.title && (
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8 text-slate-900 ${titleFontClass}`}
          >
            {content.title}
          </motion.h2>
        )}

        <motion.div
          variants={containerVariants}
          className={`grid gap-2 sm:gap-4 flex-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-${columns}`}
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(100px, 1fr))`,
          }}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.08 }}
              className="relative h-24 sm:h-32 md:h-48 rounded-lg overflow-hidden cursor-pointer group"
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
