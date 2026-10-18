import { NextResponse } from "next/server"
import { MAX_IMAGE_BYTES, MAX_IMAGE_COUNT, prepareImage, saveImages } from "@/lib/image-storage.mjs"

export const runtime = "nodejs"

export async function POST(request) {
  const origin = request.headers.get("origin")
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ message: "Upload from this website only." }, { status: 403 })
  }
  const maximumBody = MAX_IMAGE_COUNT * MAX_IMAGE_BYTES + 1024 * 1024
  if (Number(request.headers.get("content-length")) > maximumBody) {
    return NextResponse.json({ message: "The upload is too large." }, { status: 413 })
  }

  let images
  try {
    const form = await request.formData()
    const files = form.getAll("files")
    if (!files.length || files.length > MAX_IMAGE_COUNT) {
      return NextResponse.json({ message: "Choose between 1 and 8 images." }, { status: 400 })
    }
    images = await Promise.all(files.map(prepareImage))
  } catch (error) {
    return NextResponse.json({ message: error.message || "Invalid upload." }, { status: 400 })
  }

  try {
    const urls = await saveImages(images)
    return NextResponse.json({ urls }, { status: 201 })
  } catch {
    return NextResponse.json({ message: "Images could not be saved. Please try again." }, { status: 500 })
  }
}
