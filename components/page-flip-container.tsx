"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface PageFlipContainerProps {
  children: ReactNode
  isFlipping: boolean
  direction: "forward" | "backward"
}

export function PageFlipContainer({ children, isFlipping, direction }: PageFlipContainerProps) {
  return (
    <motion.div
      animate={{
        rotateY: isFlipping ? (direction === "forward" ? 90 : -90) : 0,
        opacity: isFlipping ? 0.3 : 1,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  )
}
