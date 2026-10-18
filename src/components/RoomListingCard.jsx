"use client"

import Link from "next/link"
import { ArrowUpRight, Users, Wifi, Coffee, Monitor, Wind, BedDouble, Armchair, ConciergeBell, Laptop } from "lucide-react"
import { roomName, roomPrice } from "@/lib/rooms.mjs"

const amenityIcons = { "Free WiFi": Wifi, "Tea & coffee": Coffee, "Smart TV": Monitor, "Air conditioning": Wind, "King bed": BedDouble, "Lounge area": Armchair, "Room service": ConciergeBell, Workspace: Laptop }

export default function RoomListingCard({ room }) {
  const name = roomName(room)
  return (
    <article className="stay-card">
      <div className="stay-card-photo">
        <img src={room.images?.[0] || "/placeholder.svg"} alt={name} loading="lazy" onError={event => { if (event.currentTarget.getAttribute("src") !== "/placeholder.svg") event.currentTarget.src = "/placeholder.svg" }} />
        <span className="stay-card-type">{room.roomType}</span>
      </div>
      <div className="stay-card-body">
        <div className="stay-card-meta"><span>Room {room.roomNumber}</span><span><Users size={14} aria-hidden="true" /> {room.capacity} {room.capacity === 1 ? "guest" : "guests"}</span></div>
        <h2>{name}</h2>
        <p className="stay-card-description">{room.description}</p>
        <ul className="stay-card-amenities" aria-label="Room amenities">
          {(room.amenities || []).slice(0, 4).map(amenity => {
            const Icon = amenityIcons[amenity] || BedDouble
            return <li key={amenity}><Icon size={15} aria-hidden="true" /><span>{amenity}</span></li>
          })}
        </ul>
        <div className="stay-card-bottom">
          <div className="stay-card-price"><strong>{roomPrice(room.price)}</strong><span>per night</span></div>
          <Link className="stay-card-book" href={`/userDashboard?tab=book-room&room=${encodeURIComponent(room._id)}`} aria-label={`Book ${name}`}>
            Book now <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
