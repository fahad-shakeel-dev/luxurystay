"use client"

import { ImageCarousel } from "./image-carousel"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Swal from "sweetalert2"

export function RoomCard({ room }) {
  const router = useRouter()
  const { data: session, status } = useSession()

  const handleBookRoom = () => {
    if (status === "loading") return // Do nothing while session is loading

    if (!session) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please login to book a room.",
        confirmButtonText: "Login",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/auth/login")
        }
      })
    } else {
      router.push("/book-room") // Navigate to the dedicated booking page
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
      <ImageCarousel images={room.images} />
      <div className="mt-4">
        <h3 className="font-semibold text-xl text-gray-900 mb-1">Room {room.roomNumber}</h3>
        <p className="text-gray-700 text-base mb-2">{room.roomType}</p>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{room.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-gray-900">₨{room.price.toLocaleString()}/night</span>
          <span className="text-sm text-gray-700">Capacity: {room.capacity}</span>
        </div>
        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-600">Amenities: {room.amenities.join(", ")}</p>
          </div>
        )}
        <button
          onClick={handleBookRoom}
          className="w-full bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
          disabled={status === "loading"}
        >
          Book Room
        </button>
      </div>
    </div>
  )
}
