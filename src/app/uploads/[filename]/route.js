import { readFile } from "node:fs/promises"
import path from "node:path"
import { uploadDirectory } from "@/lib/image-storage.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Serve new uploads in production without requiring another Next.js build.
export async function GET(request, { params }) {
  const { filename } = await params
  if (!/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}\.webp$/.test(filename)) {
    return new Response("Not found", { status: 404 })
  }
  try {
    const image = await readFile(path.join(uploadDirectory, filename))
    return new Response(image, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return new Response("Not found", { status: 404 })
  }
}
