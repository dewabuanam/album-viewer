"use client"

import { useState, useEffect, useCallback } from "react"

interface UseMinioMediaOptions {
  bucketName: string
  objectName: string
  expiresIn?: number
}

export function useMinioMedia({ bucketName, objectName, expiresIn = 3600 }: UseMinioMediaOptions) {
  const [url, setUrl] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadMedia = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/media/presigned-url?bucket=${encodeURIComponent(bucketName)}&object=${encodeURIComponent(objectName)}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch presigned URL")
      }

      const data = await response.json()
      setUrl(data.url || "")
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load media"))
      setUrl("")
    } finally {
      setLoading(false)
    }
  }, [bucketName, objectName])

  useEffect(() => {
    loadMedia()
  }, [loadMedia])

  return { url, loading, error, retry: loadMedia }
}
