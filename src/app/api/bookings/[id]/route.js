// import { NextResponse } from "next/server"
// import Booking from "@/models/Booking"
// import Room from "@/models/Room"
// import { connectDb } from "@/helper/db"

// export async function PUT(req, { params }) {
//   try {
//     await connectDb()
//     const data = await req.json()
//     const oldBooking = await Booking.findById(params.id)
//     const booking = await Booking.findByIdAndUpdate(params.id, data, { new: true })

//     // If status changed to approved, keep room unavailable
//     // If status changed to rejected or completed, make room available
//     if (data.status === "rejected" || data.status === "completed") {
//       await Room.findByIdAndUpdate(oldBooking.roomId, { isAvailable: true })
//     }

//     return NextResponse.json({
//       success: true,
//       data: booking,
//       message: "Booking updated successfully",
//     })
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Error updating booking",
//         error: error.message,
//       },
//       { status: 500 },
//     )
//   }
// }

import { NextResponse } from "next/server"
import Booking from "@/models/Booking"
import Room from "@/models/Room"
import { connectDb } from "@/helper/db"

export async function PUT(req, { params }) {
  try {
    await connectDb()
    const data = await req.json()
    const oldBooking = await Booking.findById(params.id)
    const booking = await Booking.findByIdAndUpdate(params.id, data, { new: true })

    // If status changed to rejected or completed, make room available
    if (data.status === "rejected" || data.status === "completed") {
      await Room.findByIdAndUpdate(oldBooking.roomId, { isAvailable: true })
    }
    // If status changed to approved, make room unavailable
    if (data.status === "approved") {
      await Room.findByIdAndUpdate(oldBooking.roomId, { isAvailable: false })
    }

    return NextResponse.json({
      success: true,
      data: booking,
      message: "Booking updated successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating booking",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
