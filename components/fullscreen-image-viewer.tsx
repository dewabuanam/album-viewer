"use client"

import React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import Image from "next/image"

interface FullscreenImageViewerProps {
  isOpen: boolean
  imageUrl: string
  onClose: () => void
}

export function FullscreenImageViewer({ isOpen, imageUrl, onClose }: FullscreenImageViewerProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on the backdrop, not on child elements
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEscape)
      return () => window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/95 z-50 cursor-pointer"
          />

          {/* Image Container - True Full Screen */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-w-full max-h-full">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt="Fullscreen view"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="fixed top-24 right-4 sm:top-24 sm:right-8 z-50 p-2 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
          >
            <X size={24} className="text-white" />
          </motion.button>
        </>
      )}
    </AnimatePresence>
  )
}
