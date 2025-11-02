"use client"

import type { PageContent } from "@/lib/types"
import { motion } from "framer-motion"

interface FullImage4TextPageProps {
  content: PageContent
}

export function FullImage4TextPage({ content }: FullImage4TextPageProps) {
  const images = content.images || []

  return (
    <div className="w-full h-full flex flex-col p-8 gap-6 overflow-auto">
      {/* Text Section */}
      {(content.title || content.description) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-2"
        >
          {content.title && <h2 className="text-2xl font-bold text-foreground">{content.title}</h2>}
          {content.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{content.description}</p>
          )}
        </motion.div>
      )}

      {/* Images Section */}
      <div className="flex gap-0 flex-1 min-h-0">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex-1 overflow-hidden"
          >
            <img src={image || "/placeholder.svg"} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
