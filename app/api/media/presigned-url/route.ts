import { getPresignedUrl, isMinioConfigured } from "@/lib/minio-client"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    if (!isMinioConfigured()) {
      return NextResponse.json({ url: "" }, { status: 200 })
    }

    const searchParams = request.nextUrl.searchParams
    const bucketName = searchParams.get("bucket") || "albums"
    const objectName = searchParams.get("object")

    if (!objectName) {
      return NextResponse.json({ error: "Missing object name" }, { status: 400 })
    }

    const url = await getPresignedUrl(bucketName, objectName)
    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error in presigned URL route:", error)
    return NextResponse.json({ error: "Failed to generate presigned URL" }, { status: 500 })
  }
}
