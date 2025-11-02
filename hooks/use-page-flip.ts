"use client"

import { useState, useCallback } from "react"

interface UsePageFlipOptions {
  totalPages: number
  onPageChange?: (pageIndex: number) => void
}

export function usePageFlip({ totalPages, onPageChange }: UsePageFlipOptions) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<"forward" | "backward">("forward")

  const goToPage = useCallback(
    (pageIndex: number) => {
      // Guard against invalid page index or ongoing flip
      if (pageIndex < 0 || pageIndex >= totalPages) return

      setIsFlipping((flipping) => {
        if (flipping) return true // prevent new flips while one is active

        const direction = pageIndex > currentPageIndex ? "forward" : "backward"
        setFlipDirection(direction)
        setIsFlipping(true)

        // Simulate flip animation delay
        setTimeout(() => {
          setCurrentPageIndex(pageIndex)
          setIsFlipping(false)
          onPageChange?.(pageIndex)
        }, 300)

        return true
      })
    },
    [currentPageIndex, totalPages, onPageChange],
  )

  const nextPage = useCallback(() => {
    goToPage(currentPageIndex + 1)
  }, [currentPageIndex, goToPage])

  const prevPage = useCallback(() => {
    goToPage(currentPageIndex - 1)
  }, [currentPageIndex, goToPage])

  const canGoNext = currentPageIndex < totalPages - 1
  const canGoPrev = currentPageIndex > 0

  return {
    currentPageIndex,
    isFlipping,
    flipDirection,
    goToPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
  }
}
