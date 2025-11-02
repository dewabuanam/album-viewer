"use client"

import type { PageContent } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { FullscreenImageViewer } from "../fullscreen-image-viewer"

interface CollagePageProps {
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

export function CollagePage({ content }: CollagePageProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const images = content.images || []
  const titleFontClass = getFontClass(content.titleFont)

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
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full h-full p-4 sm:p-6 md:p-8 bg-background flex flex-col overflow-y-auto"
      >
        {content.title && (
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-foreground-900 ${titleFontClass}`}
          >
            {content.title}
          </motion.h2>
        )}

        <motion.div
          variants={containerVariants}
          className="flex-1 grid gap-2 sm:gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
            gridAutoRows: "minmax(80px, auto)",
          }}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.1, rotate: 2 }}
              className="relative rounded-lg overflow-hidden shadow-md cursor-pointer"
              style={{
                gridColumn: index % 5 === 0 ? "span 2" : "span 1",
                gridRow: index % 7 === 0 ? "span 2" : "span 1",
              }}
              onClick={() => setFullscreenImage(image)}
            >
              <Image src={image || "/placeholder.svg"} alt={`Collage ${index + 1}`} fill className="object-cover" />
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
