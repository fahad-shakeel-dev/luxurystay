import test from "node:test"
import assert from "node:assert/strict"
import { readFile, unlink } from "node:fs/promises"
import path from "node:path"
import Module, { createRequire } from "node:module"
import sharp from "sharp"
import * as storage from "../src/lib/image-storage.mjs"

const require = createRequire(import.meta.url)

async function loadRoute(file) {
  const filename = path.resolve(file)
  const swc = require("next/dist/build/swc")
  await swc.loadBindings()
  const { code } = await swc.transform(await readFile(filename, "utf8"), {
    filename, jsc: { parser: { syntax: "ecmascript" } }, module: { type: "commonjs" },
  })
  const route = new Module(filename)
  route.filename = filename
  route.paths = Module._nodeModulePaths(path.dirname(filename))
  const defaultRequire = route.require.bind(route)
  route.require = name => name === "@/lib/image-storage.mjs" ? storage : defaultRequire(name)
  route._compile(code, filename)
  return route.exports
}

test("image validation rejects invalid, oversized, and disguised SVG files", async () => {
  await assert.rejects(storage.prepareImage(new Blob(["invalid"], { type: "image/png" })))
  await assert.rejects(storage.prepareImage(new Blob(["<svg/>"], { type: "image/svg+xml" })))
  await assert.rejects(storage.prepareImage(new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>'], { type: "image/png" })))
  await assert.rejects(storage.prepareImage({ type: "image/png", size: storage.MAX_IMAGE_BYTES + 1, arrayBuffer() { throw new Error("Should not read oversized data") } }), /5 MB/)
})

test("Vercel uploads require a connected Blob store", async () => {
  const originalVercel = process.env.VERCEL
  const originalToken = process.env.BLOB_READ_WRITE_TOKEN
  process.env.VERCEL = "1"
  delete process.env.BLOB_READ_WRITE_TOKEN
  try {
    await assert.rejects(storage.saveImages([Buffer.from("image")]), /Connect a Vercel Blob store/)
  } finally {
    if (originalVercel === undefined) delete process.env.VERCEL
    else process.env.VERCEL = originalVercel
    if (originalToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN
    else process.env.BLOB_READ_WRITE_TOKEN = originalToken
  }
})

test("upload and serving routes save real images locally and prevent unsafe requests", async () => {
  const uploads = await loadRoute("src/app/api/uploads/route.js")
  const serving = await loadRoute("src/app/uploads/[filename]/route.js")
  const empty = new FormData()
  assert.equal((await uploads.POST(new Request("http://localhost/api/uploads", { method: "POST", body: empty }))).status, 400)
  assert.equal((await uploads.POST(new Request("http://localhost/api/uploads", { method: "POST", headers: { origin: "https://unrelated.example" } }))).status, 403)
  assert.equal((await uploads.POST(new Request("http://localhost/api/uploads", { method: "POST", headers: { "content-length": String(50 * 1024 * 1024) } }))).status, 413)
  const tooMany = new FormData()
  for (let i = 0; i < 9; i++) tooMany.append("files", new Blob(["x"], { type: "image/png" }), "x.png")
  assert.equal((await uploads.POST(new Request("http://localhost/api/uploads", { method: "POST", body: tooMany }))).status, 400)

  const png = await sharp({ create: { width: 2400, height: 1200, channels: 3, background: "#2563eb" } }).png().toBuffer()
  const body = new FormData()
  body.append("files", new Blob([png], { type: "image/png" }), "../../unsafe-name.png")
  const uploaded = await uploads.POST(new Request("http://localhost/api/uploads", { method: "POST", body }))
  assert.equal(uploaded.status, 201)
  const { urls } = await uploaded.json()
  const filename = path.basename(urls[0])
  try {
    assert.match(urls[0], /^\/uploads\/[a-f0-9-]+\.webp$/)
    const served = await serving.GET(null, { params: Promise.resolve({ filename }) })
    assert.equal(served.status, 200)
    assert.equal(served.headers.get("content-type"), "image/webp")
    const metadata = await sharp(Buffer.from(await served.arrayBuffer())).metadata()
    assert.equal(metadata.width, 1920)
    assert.equal(metadata.height, 960)
    assert.equal(metadata.format, "webp")
    assert.equal((await serving.GET(null, { params: Promise.resolve({ filename: "../.env" }) })).status, 404)
    assert.equal((await serving.GET(null, { params: Promise.resolve({ filename: "00000000-0000-0000-0000-000000000000.webp" }) })).status, 404)
  } finally {
    await unlink(path.join(storage.uploadDirectory, filename))
  }
})

test("remote image migration rejects unsupported hosts", async () => {
  assert.equal(await storage.localizeImage("/images/room.jpg"), "/images/room.jpg")
  await assert.rejects(storage.localizeImage("http://res.cloudinary.com/image.png"))
  await assert.rejects(storage.localizeImage("https://127.0.0.1/image.png"))
})
