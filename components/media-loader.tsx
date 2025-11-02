"use client"

import { useMinioMedia } from "@/hooks/use-minio-media"
import Image from "next/image"
import { motion } from "framer-motion"

interface MediaLoaderProps {
  src: string
  alt: string
  bucketName?: string
  fill?: boolean
  className?: string
  objectFit?: "cover" | "contain" | "fill" | "scale-down"
}

export function MediaLoader({
  src,
  alt,
  bucketName = "albums",
  fill = false,
  className = "",
  objectFit = "cover",
}: MediaLoaderProps) {
  const isMinioPath = src && !src.startsWith("http")
  const objectName = isMinioPath ? src : src

  const { url, loading, error } = useMinioMedia({
    bucketName,
    objectName,
  })

  const displayUrl = isMinioPath ? url : src

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-slate-200 ${className}`}>
        <span className="text-slate-500 text-sm">Failed to load media</span>
      </div>
    )
  }

  if (loading && isMinioPath) {
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className={`flex items-center justify-center bg-slate-100 ${className}`}
      >
        <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full" />
      </motion.div>
    )
  }

  if (fill) {
    return (
      <Image src={displayUrl || "/placeholder.svg"} alt={alt} fill className={`object-${objectFit} ${className}`} />
    )
  }

  return <img src={displayUrl || "/placeholder.svg"} alt={alt} className={`object-${objectFit} ${className}`} />
}
