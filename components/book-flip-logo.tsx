"use client"

import { motion } from "framer-motion"

export function BookFlipLogo() {
  return (
    <motion.div
      className="relative w-8 h-8"
      animate={{ rotateY: [0, 180, 360] }}
      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      style={{ perspective: "1000px" }}
    >
      {/* Book Cover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 rounded-sm shadow-lg flex items-center justify-center"
        style={{
          backfaceVisibility: "hidden",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </motion.div>

      {/* Book Back */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/60 to-primary/40 rounded-sm shadow-lg flex items-center justify-center"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <div className="w-1 h-4 bg-white/50 rounded-full" />
      </motion.div>
    </motion.div>
  )
}
