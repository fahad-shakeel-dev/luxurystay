import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { randomUUID } from "node:crypto"
import sharp from "sharp"

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_IMAGE_COUNT = 8
export const uploadDirectory = path.join(process.cwd(), "public", "uploads")
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"])

export async function prepareImage(file) {
  if (!file || typeof file.arrayBuffer !== "function" || !allowedTypes.has(file.type)) {
    throw new Error("Choose a JPEG, PNG, WebP, or AVIF image.")
  }
  if (!file.size || file.size > MAX_IMAGE_BYTES) {
    throw new Error("Each image must be between 1 byte and 5 MB.")
  }
  try {
    const source = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40000000 })
    const metadata = await source.metadata()
    if (!["jpeg", "png", "webp", "heif"].includes(metadata.format)) {
      throw new Error("Unsupported image format.")
    }
    return await source
      .rotate()
      .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer()
  } catch {
    throw new Error("This image could not be read. Choose a valid image under 40 megapixels.")
  }
}

export async function saveImages(images) {
  await mkdir(uploadDirectory, { recursive: true })
  return Promise.all(images.map(async (image) => {
    const filename = `${randomUUID()}.webp`
    await writeFile(path.join(uploadDirectory, filename), image, { flag: "wx" })
    return `/uploads/${filename}`
  }))
}

export async function localizeImage(url) {
  if (typeof url !== "string" || !url) return "/placeholder.svg"
  if (url.startsWith("/") && !url.startsWith("//")) return url
  const remote = new URL(url)
  const allowedHost = ["res.cloudinary.com", "images.unsplash.com", "plus.unsplash.com"].includes(remote.hostname)
    || remote.hostname.endsWith(".googleusercontent.com")
  if (remote.protocol !== "https:" || !allowedHost || remote.port) {
    throw new Error("Unsupported remote image host.")
  }
  const response = await fetch(remote, { redirect: "error", signal: AbortSignal.timeout(15000) })
  if (!response.ok || !response.body) throw new Error("Image download failed.")
  if (Number(response.headers.get("content-length")) > MAX_IMAGE_BYTES) {
    throw new Error("Remote image exceeds 5 MB.")
  }
  const chunks = []
  let size = 0
  const reader = response.body.getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_IMAGE_BYTES) throw new Error("Remote image exceeds 5 MB.")
      chunks.push(value)
    }
  } finally {
    await reader.cancel()
  }
  const image = new Blob(chunks, { type: response.headers.get("content-type")?.split(";")[0] || "" })
  const encoded = await prepareImage(image)
  const [local] = await saveImages([encoded])
  return local
}
