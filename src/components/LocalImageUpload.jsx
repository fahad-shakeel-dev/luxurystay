"use client"

import { useRef, useState } from "react"

export default function LocalImageUpload({ multiple = false, onUpload, children }) {
  const input = useRef(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  async function upload(event) {
    const files = Array.from(event.target.files || [])
    event.target.value = ""
    if (!files.length) return
    setError("")
    if (files.length > 8 || files.some(file => file.size > 5 * 1024 * 1024)) {
      setError("Choose up to 8 images, no larger than 5 MB each.")
      return
    }
    setIsUploading(true)
    try {
      const body = new FormData()
      files.forEach(file => body.append("files", file))
      const response = await fetch("/api/uploads", { method: "POST", body })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || "Upload failed. Please try again.")
      onUpload(result.urls)
    } catch (error) {
      setError(error.message || "Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple={multiple} onChange={upload} className="hidden" aria-label={multiple ? "Choose images" : "Choose an image"} />
      {children({ open: () => { if (!isUploading) input.current?.click() }, isUploading })}
      {isUploading && <p role="status" className="mt-2 text-sm text-amber-500">Uploading image…</p>}
      {error && <p role="alert" className="mt-2 max-w-xs text-sm text-red-500">{error}</p>}
    </>
  )
}
