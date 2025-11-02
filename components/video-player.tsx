"use client"

import { motion } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { useVideoPlayer } from "@/hooks/use-video-player"

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  description?: string
}

export function VideoPlayer({ src, poster, title, description }: VideoPlayerProps) {
  const {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    handleTimeUpdate,
    handleLoadedMetadata,
    seek,
    handleVolumeChange,
    toggleFullscreen,
    formatTime,
  } = useVideoPlayer()

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="w-full h-full flex flex-col bg-black">
      {/* Video Container */}
      <div className="flex-1 relative bg-black flex items-center justify-center group">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full h-full object-contain"
        />

        {/* Play Button Overlay */}
        {!isPlaying && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
          >
            <Play size={80} className="text-white fill-white" />
          </motion.button>
        )}

        {/* Controls Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 space-y-3"
        >
          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <div
              className="flex-1 h-1 bg-slate-600 rounded-full cursor-pointer group/progress"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const percent = (e.clientX - rect.left) / rect.width
                seek(percent * duration)
              }}
            >
              <motion.div
                className="h-full bg-amber-600 rounded-full"
                style={{ width: `${progress}%` }}
                whileHover={{ height: "0.375rem" }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="text-white hover:text-amber-600 transition-colors"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="fill-white" />}
              </motion.button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVolumeChange(volume === 0 ? 1 : 0)}
                  className="text-white hover:text-amber-600 transition-colors"
                >
                  {volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </motion.button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number.parseFloat(e.target.value))}
                  className="w-20 h-1 bg-slate-600 rounded-full appearance-none cursor-pointer accent-amber-600"
                />
              </div>

              {/* Time Display */}
              <span className="text-white text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Fullscreen */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className="text-white hover:text-amber-600 transition-colors"
            >
              <Maximize size={24} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Video Info */}
      {(title || description) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="p-8 bg-white"
        >
          {title && <h2 className="text-3xl font-serif font-bold mb-3 text-slate-900">{title}</h2>}
          {description && <p className="text-lg text-slate-700 leading-relaxed">{description}</p>}
        </motion.div>
      )}
    </div>
  )
}
