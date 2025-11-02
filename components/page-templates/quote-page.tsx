"use client"

import type { PageContent } from "@/lib/types"
import { motion } from "framer-motion"
import { highlightText } from "@/lib/highlight-utils"

interface QuotePageProps {
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

export function QuotePage({ content, highlightedText }: QuotePageProps) {
  const titleFontClass = getFontClass(content.titleFont)
  const textFontClass = getFontClass(content.textFont)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-gradient-to-br from-slate-100 to-slate-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <div className="text-4xl sm:text-5xl md:text-6xl text-amber-600 mb-4 sm:mb-6 font-serif">"</div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={`text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-4 sm:mb-8 leading-relaxed ${titleFontClass}`}
        >
          {highlightedText
            ? highlightText(content.quote || content.description || "", highlightedText)
            : content.quote || content.description}
        </motion.p>
        {content.author && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`text-base sm:text-lg md:text-xl text-slate-600 font-light ${textFontClass}`}
          >
            — {highlightedText ? highlightText(content.author, highlightedText) : content.author}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}
