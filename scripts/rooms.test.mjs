import test from "node:test"
import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"
import path from "node:path"
import Module, { createRequire } from "node:module"
import { starterRooms } from "../src/data/rooms.mjs"
import { roomName, roomPrice, selectRooms } from "../src/lib/rooms.mjs"

const require = createRequire(import.meta.url)

test("starter rooms have unique numbers, bookable fields, and local photos", async () => {
  assert.equal(new Set(starterRooms.map(room => room.roomNumber)).size, 6)
  for (const room of starterRooms) {
    assert.ok(room.name && room.description && room.price > 0 && room.capacity > 0)
    for (const image of room.images) await access(path.join("public", image.slice(1)))
  }
})

test("room filters and price sorting respect availability without mutating input", () => {
  const records = [...starterRooms, { ...starterRooms[0], roomNumber: "999", isAvailable: false }]
  assert.equal(selectRooms(records).length, 6)
  assert.equal(selectRooms(records, "Deluxe").length, 2)
  assert.deepEqual(selectRooms(records, "All", "price-high").map(room => room.price), [62000, 38000, 28500, 24000, 18000, 12000])
  assert.equal(records[0].roomNumber, "101")
  assert.equal(selectRooms(records, "Unavailable").length, 0)
})

test("room display supports database fields and legacy records", () => {
  assert.equal(roomName({ roomType: "Deluxe" }), "Deluxe Room")
  assert.equal(roomName({ roomType: "Presidential" }), "Presidential Suite")
  assert.equal(roomPrice(12000), "PKR 12,000")
})

test("room cards render real room fields and link to the selected booking", async () => {
  const filename = path.resolve("src/components/RoomListingCard.jsx")
  const { code } = await require("next/dist/build/swc").transform(await readFile(filename, "utf8"), {
    filename, jsc: { parser: { syntax: "ecmascript", jsx: true }, transform: { react: { runtime: "automatic" } } }, module: { type: "commonjs" },
  })
  const card = new Module(filename)
  card.filename = filename
  card.paths = Module._nodeModulePaths(path.dirname(filename))
  const defaultRequire = card.require.bind(card)
  card.require = name => name === "@/lib/rooms.mjs" ? { roomName, roomPrice } : defaultRequire(name)
  card._compile(code, filename)
  const React = require("react")
  const markup = require("react-dom/server").renderToStaticMarkup(React.createElement(card.exports.default, { room: { ...starterRooms[0], _id: "test-room" } }))
  assert.match(markup, /Classic Single/)
  assert.match(markup, /PKR 12,000/)
  assert.match(markup, /Room 101/)
  assert.match(markup, /tab=book-room&amp;room=test-room/)
  assert.match(markup, /\/images\/photo-/)
})

test("dashboard CSS cannot change public-page typography or image sizes", async () => {
  const postcss = require("postcss")
  for (const file of ["src/app/admin/AdminDashboard.css", "src/app/userDashboard/UserDashboard.css"]) {
    const root = postcss.parse(await readFile(file, "utf8"))
    root.walkRules(rule => {
      if (rule.parent.type === "atrule" && rule.parent.name.endsWith("keyframes")) return
      for (const selector of rule.selectors) assert.ok(selector.startsWith(":where(.") || selector.includes(".swal2-"), `Unscoped dashboard selector: ${selector}`)
    })
  }
})
