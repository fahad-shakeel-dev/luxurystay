import nextEnv from "@next/env"
import mongoose from "mongoose"
import { access } from "node:fs/promises"
import path from "node:path"
import Room from "../src/models/Room.js"
import { starterRooms } from "../src/data/rooms.mjs"

nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} })
try {
  if (!process.env.MONGO_DB_URL) throw new Error("Missing database configuration")
  for (const room of starterRooms) {
    await new Room(room).validate()
    for (const image of room.images) await access(path.join(process.cwd(), "public", image.slice(1)))
  }
  await mongoose.connect(process.env.MONGO_DB_URL, { dbName: "HotelManagementSystem", serverSelectionTimeoutMS: 15000 })
  await Room.init()
  const result = await Room.bulkWrite(starterRooms.map(room => ({
    updateOne: { filter: { roomNumber: room.roomNumber }, update: { $setOnInsert: room }, upsert: true },
  })))
  console.log(`Added ${result.upsertedCount} rooms. Preserved ${result.matchedCount} existing room records.`)
  const total = await Room.countDocuments({ isAvailable: true })
  console.log(`Available rooms in HotelManagementSystem: ${total}.`)
} catch {
  console.error("Room setup failed. Check MONGO_DB_URL, database access, and local room image files.")
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
