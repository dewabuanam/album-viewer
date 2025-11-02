"use client"
import type { Album, PageContent } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { CoverPage } from "./page-templates/cover-page"
import { SingleImagePage } from "./page-templates/single-image-page"
import { GridPage } from "./page-templates/grid-page"
import { TextImagePage } from "./page-templates/text-image-page"
import { QuotePage } from "./page-templates/quote-page"
import { FullImagePage } from "./page-templates/full-image-page"
import { FullImage2Page } from "./page-templates/full-image-2-page"
import { FullImage4Page } from "./page-templates/full-image-4-page"
import { FullImage6Page } from "./page-templates/full-image-6-page"
import { FullImage8Page } from "./page-templates/full-image-8-page"
import { FullImage10Page } from "./page-templates/full-image-10-page"
import { FullImage12Page } from "./page-templates/full-image-12-page"
import { FullImage16Page } from "./page-templates/full-image-16-page"
import { FullImage2TextPage } from "./page-templates/full-image-2-text-page"
import { FullImage4TextPage } from "./page-templates/full-image-4-text-page"
import { FullImage6TextPage } from "./page-templates/full-image-6-text-page"
import { FullImage8TextPage } from "./page-templates/full-image-8-text-page"
import { FullImage10TextPage } from "./page-templates/full-image-10-text-page"
import { FullImage12TextPage } from "./page-templates/full-image-12-text-page"
import { FullImage16TextPage } from "./page-templates/full-image-16-text-page"
import { TwoColumnPage } from "./page-templates/two-column-page"
import { CollagePage } from "./page-templates/collage-page"
import { VideoPage } from "./page-templates/video-page"
import { VideoGalleryPage } from "./page-templates/video-gallery-page"
import { GridTwoSquarePage } from "./page-templates/grid-two-square-page"
import { GridTwoRectPage } from "./page-templates/grid-two-rect-page"
import { Grid2WithTextPage } from "./page-templates/grid-2-with-text-page"
import { Grid6Page } from "./page-templates/grid-6-page"
import { Grid8Page } from "./page-templates/grid-8-page"
import { Grid10Page } from "./page-templates/grid-10-page"
import { Grid12Page } from "./page-templates/grid-12-page"
import { Grid16Page } from "./page-templates/grid-16-page"
import { FullImage4GridPage } from "./page-templates/full-image-4-grid-page"
import { FullImage8GridPage } from "./page-templates/full-image-8-grid-page"
import { FullImage16GridPage } from "./page-templates/full-image-16-grid-page"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { usePageFlip } from "@/hooks/use-page-flip"
import { useEffect } from "react"
import { BookFlipLogo } from "./book-flip-logo"

interface BookViewerProps {
  album: Album
  highlightedPageIndex?: number | null
  highlightedText?: string
  searchActive?: boolean
}

export function BookViewer({ album, highlightedPageIndex, highlightedText, searchActive = false }: BookViewerProps) {
  const { currentPageIndex, isFlipping, flipDirection, nextPage, prevPage, canGoNext, canGoPrev, goToPage } =
    usePageFlip({
      totalPages: album.pages.length,
    })

  useEffect(() => {
    if (highlightedPageIndex !== null && highlightedPageIndex !== undefined) {
      goToPage(highlightedPageIndex)
    }
  }, [highlightedPageIndex, goToPage])

  const currentPage = album.pages[currentPageIndex]

  const renderPage = (page: PageContent) => {
    const isHighlighted = highlightedPageIndex === album.pages.indexOf(page)

    switch (page.template) {
      case "cover":
        return <CoverPage content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "single-image":
        return <SingleImagePage content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "grid-3":
      case "grid-4":
        return <GridPage content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "grid-2-square":
        return <GridTwoSquarePage content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "grid-2-rect":
        return <GridTwoRectPage content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "grid-2-with-text":
        return <Grid2WithTextPage content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "grid-6":
        return <Grid6Page content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "grid-8":
        return <Grid8Page content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "grid-10":
        return <Grid10Page content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "grid-12":
        return <Grid12Page content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "grid-16":
        return <Grid16Page content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "text-image":
        return <TextImagePage content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "quote":
        return <QuotePage content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "full-image":
        return <FullImagePage content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "full-image-2":
        return <FullImage2Page content={page} />
      case "full-image-4":
        return <FullImage4Page content={page} />
      case "full-image-6":
        return <FullImage6Page content={page} />
      case "full-image-8":
        return <FullImage8Page content={page} />
      case "full-image-10":
        return <FullImage10Page content={page} />
      case "full-image-12":
        return <FullImage12Page content={page} />
      case "full-image-16":
        return <FullImage16Page content={page} />
      case "full-image-2-text":
        return <FullImage2TextPage content={page} />
      case "full-image-4-text":
        return <FullImage4TextPage content={page} />
      case "full-image-6-text":
        return <FullImage6TextPage content={page} />
      case "full-image-8-text":
        return <FullImage8TextPage content={page} />
      case "full-image-10-text":
        return <FullImage10TextPage content={page} />
      case "full-image-12-text":
        return <FullImage12TextPage content={page} />
      case "full-image-16-text":
        return <FullImage16TextPage content={page} />
      case "full-image-4-grid":
        return <FullImage4GridPage content={page} />
      case "full-image-8-grid":
        return <FullImage8GridPage content={page} />
      case "full-image-16-grid":
        return <FullImage16GridPage content={page} />
      case "two-column":
        return <TwoColumnPage content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "collage":
        return <CollagePage content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "video":
        return <VideoPage content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      case "video-gallery":
        return <VideoGalleryPage content={page} highlightedText={isHighlighted ? highlightedText : ""} />
      default:
        return <div>Unknown template</div>
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Book Container - Responsive */}
      <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-center">
        {/* Left Page - Hidden on mobile */}
        <div className="hidden md:flex w-1/2 h-full bg-background/95 backdrop-blur-sm items-center justify-center border-r border-white/30 overflow-hidden shadow-lg">
          <AnimatePresence mode="wait">
            {currentPageIndex > 0 ? (
              <motion.div
                key={`left-${currentPageIndex}`}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full flex items-center justify-center"
              >
                {renderPage(album.pages[currentPageIndex - 1])}
              </motion.div>
            ) : (
              <motion.div
                key="left-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-6"
              >
                <BookFlipLogo />
                <p className="text-center">Start of album</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Page - Full width on mobile */}
        <div className="w-full md:w-1/2 h-full bg-background/95 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={`right-${currentPageIndex}`}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-full flex items-center justify-center"
            >
              {renderPage(currentPage)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 flex gap-2 sm:gap-4 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevPage}
          disabled={!canGoPrev || isFlipping || searchActive}
          className="p-2 sm:p-3 rounded-full bg-background/80 backdrop-blur-sm  hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} className="sm:w-6 sm:h-6 text-foreground" />
        </motion.button>

        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-background/80 backdrop-blur-sm  rounded-full">
          <span className="text-xs sm:text-sm font-medium text-foreground">
            {currentPageIndex + 1} / {album.pages.length}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextPage}
          disabled={!canGoNext || isFlipping || searchActive}
          className="p-2 sm:p-3 rounded-full bg-background/80 backdrop-blur-sm  hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={20} className="sm:w-6 sm:h-6 text-foreground" />
        </motion.button>
      </div>
    </div>
  )
}
