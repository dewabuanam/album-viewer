"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import type { Album } from "@/lib/types"
import { BookViewer } from "./book-viewer"
import { AlbumDrawer } from "./album-drawer"
import { DarkModeToggle } from "./dark-mode-toggle"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  SearchIcon,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Music,
  Maximize,
  Minimize,
  RotateCcw,
  ChevronLeft,
  Play,
  Pause,
} from "lucide-react"
import { extractYouTubeVideoId } from "@/lib/youtube-utils"

interface AlbumViewerProps {
  album: Album
  albums: Album[]
  onBack: () => void
  onSelectAlbum: (albumId: string) => void
}

interface SearchMatch {
  pageIndex: number
  text: string
  field: string
}

type RepeatMode = "off" | "all" | "one"

function fuzzyMatch(query: string, text: string): boolean {
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()

  let queryIdx = 0
  let textIdx = 0

  while (queryIdx < queryLower.length && textIdx < textLower.length) {
    if (queryLower[queryIdx] === textLower[textIdx]) {
      queryIdx++
    }
    textIdx++
  }

  return queryIdx === queryLower.length
}

export function AlbumViewer({ album, albums, onBack, onSelectAlbum }: AlbumViewerProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [matches, setMatches] = useState<SearchMatch[]>([])
  const [highlightedPageIndex, setHighlightedPageIndex] = useState<number | null>(null)
  const [highlightedText, setHighlightedText] = useState<string>("")
  const [musicPlaying, setMusicPlaying] = useState(true)
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0)
  const [musicListOpen, setMusicListOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("all")
  const [isAutoPlayMode, setIsAutoPlayMode] = useState(false)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [showMusicTitle, setShowMusicTitle] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const iframeRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const viewerContainerRef = useRef<HTMLDivElement>(null)
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const musicNotificationTimerRef = useRef<NodeJS.Timeout | null>(null)

  const musicPlaylist = Array.isArray(album.music)
    ? album.music.map((m) => (typeof m === "string" ? { title: "Music", url: m } : m))
    : album.music
      ? [album.music]
      : []
  const currentMusic = musicPlaylist[currentMusicIndex] || null
  const isYouTubeMusic = currentMusic ? extractYouTubeVideoId(currentMusic.url) !== null : false

  const findMatches = (query: string) => {
    if (!query.trim()) {
      setMatches([])
      setCurrentMatchIndex(0)
      setHighlightedPageIndex(null)
      setHighlightedText("")
      return
    }

    const found: SearchMatch[] = []
    album.pages.forEach((page, pageIndex) => {
      const fields = [
        { text: page.title, field: "title" },
        { text: page.subtitle, field: "subtitle" },
        { text: page.text, field: "text" },
        { text: page.caption, field: "caption" },
        { text: page.quote, field: "quote" },
        { text: page.author, field: "author" },
        { text: page.description, field: "description" },
      ].filter((f) => f.text)

      fields.forEach(({ text, field }) => {
        if (text && fuzzyMatch(query, text)) {
          found.push({ pageIndex, text, field })
        }
      })
    })

    setMatches(found)
    setCurrentMatchIndex(0)
    if (found.length > 0) {
      setHighlightedPageIndex(found[0].pageIndex)
      setHighlightedText(found[0].text)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (matches.length === 0) {
        findMatches(searchQuery)
      } else {
        const nextIndex = (currentMatchIndex + 1) % matches.length
        setCurrentMatchIndex(nextIndex)
        setHighlightedPageIndex(matches[nextIndex].pageIndex)
        setHighlightedText(matches[nextIndex].text)
      }
    }
  }

  useEffect(() => {
    findMatches(searchQuery)
  }, [searchQuery, album.pages])

  useEffect(() => {
    if (!headerVisible) {
      setSearchOpen(false)
      setSearchQuery("")
      setMatches([])
      setHighlightedPageIndex(null)
      setHighlightedText("")
    }
  }, [headerVisible])

  const handleAudioEnd = useCallback(() => {
    if (repeatMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => console.log("Autoplay blocked"))
      } else if (playerRef.current) {
        playerRef.current.seekTo(0)
        playerRef.current.playVideo()
      }
    } else if (currentMusicIndex < musicPlaylist.length - 1) {
      setCurrentMusicIndex(currentMusicIndex + 1)
    } else if (repeatMode === "all") {
      setCurrentMusicIndex(0)
    }
  }, [currentMusicIndex, musicPlaylist.length, repeatMode])

  useEffect(() => {
    if (window.YT) return
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    document.body.appendChild(tag)
  }, [])

  useEffect(() => {
    if (!isYouTubeMusic || !iframeRef.current) return

    const createPlayer = () => {
      if (playerRef.current) playerRef.current.destroy()

      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: extractYouTubeVideoId(currentMusic.url),
        playerVars: { autoplay: 1, controls: 0 },
        events: {
          onReady: () => {
            if (isMuted) playerRef.current.mute()
            else playerRef.current.unMute()

            if (musicPlaying) playerRef.current.playVideo()
            else playerRef.current.pauseVideo()
          },
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.ENDED) handleAudioEnd()
          },
        },
      })
    }

    if (window.YT && window.YT.Player) createPlayer()
    else (window as any).onYouTubeIframeAPIReady = createPlayer

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [currentMusic])

  useEffect(() => {
    if (!currentMusic) return

    if (isYouTubeMusic && playerRef.current?.playVideo) {
      if (isMuted) playerRef.current.mute()
      else playerRef.current.unMute()

      if (musicPlaying) playerRef.current.playVideo()
      else playerRef.current.pauseVideo()
    } else if (audioRef.current) {
      audioRef.current.muted = isMuted
      if (musicPlaying) {
        audioRef.current.play().catch(() => console.log("Autoplay blocked"))
      } else {
        audioRef.current.pause()
      }
    }
  }, [musicPlaying, isYouTubeMusic, currentMusic, isMuted])

  useEffect(() => {
    if (audioRef.current) audioRef.current.onended = handleAudioEnd
  }, [handleAudioEnd])

  const handleFullscreenToggle = async () => {
    if (!viewerContainerRef.current) return
    try {
      if (!isFullscreen) {
        await viewerContainerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.log("Fullscreen error:", err)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const handleAutoPlayMode = async () => {
    if (isAutoPlayMode) {
      setIsAutoPlayMode(false)
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
      return
    }

    setIsAutoPlayMode(true)

    if (!isFullscreen && viewerContainerRef.current) {
      try {
        await viewerContainerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } catch (err) {
        console.log("Fullscreen error:", err)
      }
    }

    setHeaderVisible(false)

    setMusicPlaying(true)

    let nextPage = currentPageIndex
    autoPlayTimerRef.current = setInterval(() => {
      nextPage = (nextPage + 1) % album.pages.length
      setCurrentPageIndex(nextPage)
    }, 5000)
  }

  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
    }
  }, [])

  const handleSelectAlbum = (albumId: string) => onSelectAlbum(albumId)
  const handleMusicSelect = (index: number) => {
    setCurrentMusicIndex(index)
    setMusicPlaying(true)
    setShowMusicTitle(true)
    if (musicNotificationTimerRef.current) clearTimeout(musicNotificationTimerRef.current)
    musicNotificationTimerRef.current = setTimeout(() => {
      setShowMusicTitle(false)
    }, 10000)
  }

  useEffect(() => {
    setShowMusicTitle(true)
    if (musicNotificationTimerRef.current) clearTimeout(musicNotificationTimerRef.current)
    musicNotificationTimerRef.current = setTimeout(() => {
      setShowMusicTitle(false)
    }, 10000)
  }, [currentMusicIndex])

  useEffect(() => {
    return () => {
      if (musicNotificationTimerRef.current) clearTimeout(musicNotificationTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!audioRef.current) return

    const updateTime = () => {
      setCurrentTime(audioRef.current?.currentTime || 0)
    }

    const handleLoadedMetadata = () => {
      setDuration(audioRef.current?.duration || 0)
    }

    const interval = setInterval(updateTime, 100)
    audioRef.current.addEventListener("timeupdate", updateTime)
    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata)
    audioRef.current.addEventListener("durationchange", () => {
      setDuration(audioRef.current?.duration || 0)
    })

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateTime)
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audioRef.current.removeEventListener("durationchange", () => {})
      }
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (!isYouTubeMusic || !playerRef.current) return

    const updateYouTubeTime = () => {
      if (playerRef.current?.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime())
        setDuration(playerRef.current.getDuration())
      }
    }

    const interval = setInterval(updateYouTubeTime, 100)
    return () => clearInterval(interval)
  }, [isYouTubeMusic])

  const getRepeatButtonColor = () => (repeatMode === "off" ? "text-foreground" : "text-primary")
  const getRepeatButtonTooltip = () =>
    repeatMode === "off" ? "Repeat: Off" : repeatMode === "all" ? "Repeat: All" : "Repeat: One"

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div ref={viewerContainerRef} className="relative w-full h-screen flex flex-col bg-background">
      <div className="absolute inset-0 overflow-hidden">
        <BookViewer
          album={album}
          highlightedPageIndex={highlightedPageIndex ?? currentPageIndex}
          highlightedText={highlightedText}
          searchActive={searchOpen && matches.length > 0}
        />
      </div>

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: headerVisible ? 0 : -64 }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 z-40"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronLeft size={20} />
        </motion.button>

        <h1 className="text-lg font-bold text-foreground truncate">{album.title}</h1>

        <div className="flex items-center gap-3">
          {currentMusic && !isYouTubeMusic && <audio ref={audioRef} src={currentMusic.url} className="hidden" />}
          {currentMusic && isYouTubeMusic && <div ref={iframeRef} id="youtube-player" className="hidden" />}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAutoPlayMode}
            className={`p-2 rounded-lg transition-colors ${
              isAutoPlayMode ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
            title={isAutoPlayMode ? "Stop autoplay" : "Start autoplay"}
          >
            <Play size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFullscreenToggle}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </motion.button>

          <DarkModeToggle headerPosition />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <SearchIcon size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu size={20} />
          </motion.button>
        </div>
      </motion.div>

      <motion.button
        animate={{ top: headerVisible ? 64 : 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setHeaderVisible(!headerVisible)}
        className="absolute right-8 z-50 px-2 py-1 rounded border border-foreground/20 bg-background/80 backdrop-blur-sm shadow-md"
      >
        {headerVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </motion.button>

      <motion.button
        animate={{
          bottom: 16,
          width:
            showMusicTitle && currentMusic && musicPlaying
              ? 300
              : currentMusic && musicPlaying
              ? 70
              : 40,
        }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setMusicListOpen(!musicListOpen)}
        className="
          fixed md:left-8 left-4    /* closer to edge on mobile */
          bottom-4 md:bottom-16           /* higher position on desktop */
          z-50 
          p-2 rounded-lg border border-foreground/20 
          bg-background/80 backdrop-blur-sm 
          hover:bg-muted transition-colors 
          flex items-center gap-3 overflow-hidden
          max-w-[90vw] md:max-w-none
          screens */
        "
        title={currentMusic ? currentMusic.title : 'Toggle music list'}
      >

        <Music size={20} className="flex-shrink-0 min-w-fit" />
        {showMusicTitle && currentMusic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex-1 min-w-0"
          >
            <div className="text-sm font-medium truncate">{currentMusic.title}</div>
          </motion.div>
        )}
        {musicPlaying && currentMusic && (
          <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
            <motion.div
              animate={{ height: [8, 16, 8] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-1 bg-primary rounded-full"
            />
            <motion.div
              animate={{ height: [12, 20, 12] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, delay: 0.1 }}
              className="w-1 bg-primary rounded-full"
            />
            <motion.div
              animate={{ height: [8, 16, 8] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
              className="w-1 bg-primary rounded-full"
            />
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {musicListOpen && musicPlaylist.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: -20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 left-4 md:left-8 z-40 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg overflow-hidden max-w-[90vw] md:max-w-none"
          >
            <div className="p-3 border-b border-border">
              <h3 className="text-sm font-semibold">Playlist ({musicPlaylist.length})</h3>
            </div>

            <div className="p-3 border-b border-border space-y-2">
              {currentMusic && (
                <>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMusicPlaying(!musicPlaying)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                      title={musicPlaying ? "Pause" : "Play"}
                    >
                      {musicPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const modes: RepeatMode[] = ["off", "all", "one"]
                        const idx = modes.indexOf(repeatMode)
                        setRepeatMode(modes[(idx + 1) % modes.length])
                      }}
                      className="p-2 rounded-lg hover:bg-muted transition-colors relative"
                      title={getRepeatButtonTooltip()}
                    >
                      <RotateCcw size={18} className={getRepeatButtonColor()} />
                      {repeatMode === "one" && <span className="absolute text-xs font-bold text-primary ml-1">1</span>}
                    </motion.button>
                  </div>

                  <div className="space-y-1">
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        animate={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto">
              {musicPlaylist.map((music, index) => (
                <motion.button
                  key={index}
                  whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                  onClick={() => handleMusicSelect(index)}
                  className={`w-full text-left px-3 py-2 text-sm border-b border-border last:border-b-0 ${
                    index === currentMusicIndex
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="truncate">{music.title}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 right-0 bg-muted border-b border-border px-8 py-4 z-30"
          >
            <div className="flex items-center gap-4">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search pages... (Press Enter)"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {matches.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {currentMatchIndex + 1} / {matches.length}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlbumDrawer
        albums={albums}
        currentAlbumId={album.id}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelectAlbum={handleSelectAlbum}
      />
    </div>
  )
}
