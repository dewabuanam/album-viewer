"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface PageFlipProps {
  children: ReactNode
  isFlipping: boolean
  direction: "forward" | "backward"
  onFlipComplete?: () => void
}

export function PageFlip({ children, isFlipping, direction, onFlipComplete }: PageFlipProps) {
  const flipVariants = {
    initial: {
      rotateY: 0,
      opacity: 1,
    },
    flipping: {
      rotateY: direction === "forward" ? 180 : -180,
      opacity: 0.5,
    },
    flipped: {
      rotateY: 0,
      opacity: 1,
    },
  }

  return (
    <motion.div
      initial="initial"
      animate={isFlipping ? "flipping" : "flipped"}
      onAnimationComplete={onFlipComplete}
      variants={flipVariants}
      transition={{
        duration: 0.6,
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
