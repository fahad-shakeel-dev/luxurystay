"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { roomName, roomPrice, selectRooms } from "@/lib/rooms.mjs"

export default function FeaturedRooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const response = await fetch("/api/rooms", { signal: controller.signal, cache: "no-store" })
        const result = await response.json()
        if (!response.ok || !result.success || !Array.isArray(result.data)) throw new Error("Rooms unavailable")
        setRooms(selectRooms(result.data).slice(0, 3))
      } catch {
        if (!controller.signal.aborted) setError(true)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [])

  return (
    <section className="stays-featured home-featured" aria-labelledby="featured-rooms-heading">
      <div className="stays-container">
        <div className="stays-featured-heading">
          <div><p className="stays-eyebrow"><span /> Find your kind of comfort</p><h2 id="featured-rooms-heading">Check in. Switch off.</h2><p>A quiet retreat or a little extra room to unwind. Your stay, your way.</p></div>
          <Link href="/rooms" className="stays-featured-link">Explore all rooms <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
        {loading ? <div role="status" aria-label="Loading featured rooms" className="home-room-grid">{[1, 2, 3].map(index => <div key={index} aria-hidden="true" className="stay-skeleton home-room-skeleton"><div /><span /><span /></div>)}</div>
          : rooms.length ? <div className="home-room-grid">{rooms.map(room => (
            <Link href="/rooms" key={room._id} className="home-room" aria-label={`Explore rooms including ${roomName(room)}`}>
              <div className="home-room-photo"><img src={room.images?.[0] || "/placeholder.svg"} alt={roomName(room)} loading="lazy" onError={event => { if (event.currentTarget.getAttribute("src") !== "/placeholder.svg") event.currentTarget.src = "/placeholder.svg" }} /><span>{room.roomType}</span></div>
              <div className="home-room-info"><div><p>{room.capacity} {room.capacity === 1 ? "guest" : "guests"} <span aria-hidden="true"> / </span> Room {room.roomNumber}</p><h3>{roomName(room)}</h3><p className="home-room-price"><strong>{roomPrice(room.price)}</strong><span> / night</span></p></div><span className="home-room-arrow" aria-hidden="true"><ArrowUpRight size={20} /></span></div>
            </Link>
          ))}</div>
          : <div className="stays-message"><p>{error ? "Explore our Rooms page to check availability." : "Our rooms are currently fully booked. Please check back soon."}</p><Link href="/rooms" className="stays-featured-link">View rooms <ArrowUpRight size={18} aria-hidden="true" /></Link></div>}
      </div>
    </section>
  )
}
