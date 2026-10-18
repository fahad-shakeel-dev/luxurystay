import nextEnv from "@next/env"
import mongoose from "mongoose"
import { localizeImage } from "../src/lib/image-storage.mjs"

nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} })
const write = process.argv.includes("--write")
if (!process.env.MONGO_DB_URL) {
  console.error("Set MONGO_DB_URL in .env before migrating saved images.")
  process.exit(1)
}

const cached = new Map()
let found = 0, updated = 0, failed = 0
try {
  await mongoose.connect(process.env.MONGO_DB_URL, { dbName: "HotelManagementSystem", serverSelectionTimeoutMS: 15000 })
  for (const [name, field] of [["rooms", "images"], ["foods", "image"], ["users", "image"]]) {
    const collection = mongoose.connection.db.collection(name)
    for await (const document of collection.find({}, { projection: { [field]: 1 } })) {
      const original = document[field]
      const values = Array.isArray(original) ? original : [original]
      if (!values.some(value => typeof value === "string" && /^https?:\/\//.test(value))) continue
      found++
      if (!write) continue
      try {
        const local = []
        for (const value of values) {
          if (typeof value !== "string" || !/^https?:\/\//.test(value)) { local.push(value); continue }
          if (!cached.has(value)) cached.set(value, await localizeImage(value))
          local.push(cached.get(value))
        }
        const result = await collection.updateOne(
          { _id: document._id, [field]: original },
          { $set: { [field]: Array.isArray(original) ? local : local[0] } },
        )
        updated += result.modifiedCount
      } catch {
        failed++
        console.error(`Could not migrate one ${name} record; its image links were preserved.`)
      }
    }
  }
  console.log(`Records with remote images: ${found}. Updated: ${updated}. Failed: ${failed}.`)
  if (!write && found) console.log("Run npm run images:migrate -- --write to save photos locally and update those links.")
  if (failed) process.exitCode = 1
} catch {
  console.error("Could not connect to MongoDB. Check MONGO_DB_URL and database network access.")
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
