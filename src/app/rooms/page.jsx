"use client"

import { useEffect, useState } from "react"
import { ArrowRight, BedDouble } from "lucide-react"
import RoomListingCard from "@/components/RoomListingCard"
import { selectRooms } from "@/lib/rooms.mjs"

export default function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState("recommended")
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setError("")
      try {
        const response = await fetch("/api/rooms", { signal: controller.signal, cache: "no-store" })
        const result = await response.json()
        if (!response.ok || !result.success || !Array.isArray(result.data)) throw new Error("Rooms could not be loaded. Please try again.")
        setRooms(result.data)
      } catch (error) {
        if (!controller.signal.aborted) setError(error.message || "Rooms could not be loaded. Please try again.")
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [attempt])

  const available = selectRooms(rooms)
  const categories = ["All", ...new Set(available.map(room => room.roomType))]
  const visible = selectRooms(rooms, category, sort)

  return (
    <main className="stays-page">
      <div className="stays-container">
        <header className="stays-heading">
          <p className="stays-eyebrow"><span /> Our rooms &amp; suites</p>
          <h1>Find your space.<br /><span>Make it your stay.</span></h1>
          <p className="stays-intro">From a quiet night away to a little extra luxury, discover a room that feels just right. Thoughtful details. Genuine comfort.</p>
        </header>

        <div className="stays-toolbar">
          <div className="stays-filters" aria-label="Filter rooms by type">
            {categories.map(type => <button type="button" key={type} aria-pressed={category === type} onClick={() => setCategory(type)}>{type === "All" ? "All rooms" : type}</button>)}
          </div>
          <label className="stays-sort">Sort by
            <select value={sort} onChange={event => setSort(event.target.value)}>
              <option value="recommended">Room number</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div role="status" aria-label="Loading rooms"><div className="stays-grid" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <div className="stay-skeleton" key={index}><div /><span /><span /><span /></div>)}</div></div>
        ) : error ? (
          <div className="stays-message" role="alert"><h2>A little interruption</h2><p>{error}</p><button type="button" onClick={() => setAttempt(value => value + 1)}>Try again <ArrowRight size={16} /></button></div>
        ) : (
          <>
            <p className="stays-count" role="status">{visible.length} {visible.length === 1 ? "room" : "rooms"} available{category !== "All" ? ` - ${category}` : ""}</p>
            {visible.length ? <div className="stays-grid">{visible.map(room => <RoomListingCard key={room._id} room={room} />)}</div>
              : <div className="stays-message"><BedDouble size={32} aria-hidden="true" /><h2>{category === "All" ? "Our rooms are currently fully booked" : "No rooms in this category"}</h2><p>{category === "All" ? "Please check back soon for availability." : "Explore our other rooms to find your stay."}</p>{category !== "All" && <button type="button" onClick={() => setCategory("All")}>View all rooms <ArrowRight size={16} /></button>}</div>}
          </>
        )}
      </div>
    </main>
  )
}
