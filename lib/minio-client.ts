import * as Minio from "minio"

let minioClient: Minio.Client | null = null

export function getMinioClient(): Minio.Client {
  if (minioClient) {
    return minioClient
  }

  const endPoint = process.env.MINIO_ENDPOINT || "localhost"
  const port = Number.parseInt(process.env.MINIO_PORT || "9000")
  const useSSL = process.env.MINIO_USE_SSL === "true"
  const accessKey = process.env.MINIO_ACCESS_KEY || ""
  const secretKey = process.env.MINIO_SECRET_KEY || ""

  minioClient = new Minio.Client({
    endPoint,
    port,
    useSSL,
    accessKey,
    secretKey,
  })

  return minioClient
}

export function isMinioConfigured(): boolean {
  const accessKey = process.env.MINIO_ACCESS_KEY || ""
  const secretKey = process.env.MINIO_SECRET_KEY || ""
  const endPoint = process.env.MINIO_ENDPOINT || ""

  return !!(accessKey && secretKey && endPoint)
}

export async function getPresignedUrl(bucketName: string, objectName: string, expiresIn = 3600): Promise<string> {
  try {
    if (!isMinioConfigured()) {
      return ""
    }

    const client = getMinioClient()
    const url = await client.presignedGetObject(bucketName, objectName, expiresIn)
    return url
  } catch (error) {
    console.error("Error generating presigned URL:", error)
    return ""
  }
}

export async function listObjects(bucketName: string, prefix = ""): Promise<string[]> {
  try {
    if (!isMinioConfigured()) {
      return []
    }

    const client = getMinioClient()
    const objectsList: string[] = []

    return new Promise((resolve, reject) => {
      const stream = client.listObjects(bucketName, prefix, true)

      stream.on("data", (obj) => {
        if (obj.name) {
          objectsList.push(obj.name)
        }
      })

      stream.on("error", (err) => {
        reject(err)
      })

      stream.on("end", () => {
        resolve(objectsList)
      })
    })
  } catch (error) {
    console.error("Error listing objects:", error)
    return []
  }
}

export async function uploadObject(
  bucketName: string,
  objectName: string,
  file: Buffer | string,
  metaData?: Record<string, string>,
): Promise<void> {
  try {
    if (!isMinioConfigured()) {
      console.warn("MinIO not configured, skipping upload")
      return
    }

    const client = getMinioClient()
    await client.putObject(bucketName, objectName, file, metaData)
  } catch (error) {
    console.error("Error uploading object:", error)
    throw error
  }
}
