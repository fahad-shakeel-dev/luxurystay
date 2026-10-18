import { NextResponse } from "next/server"
import Booking from "@/models/Booking"
import Room from "@/models/Room"
import { connectDb } from "@/helper/db"
import User from "@/models/User"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { BookingInputError, validateBookingRequest, buildBooking } from "@/lib/booking-input.mjs"

export async function GET() {
  try {
    await connectDb()
    const bookings = await Booking.find({})
      .populate("userId", "name email phone image")
      .populate("roomId", "roomNumber roomType price")
    return NextResponse.json({
      success: true,
      data: bookings,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching bookings",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Please sign in before booking a room." }, { status: 401 })
    }
    let data
    try { data = await req.json() } catch {
      return NextResponse.json({ success: false, message: "Invalid booking details. Please try again." }, { status: 400 })
    }
    validateBookingRequest(data)
    await connectDb()
    // Resolve ownership from the signed session, never a browser-supplied ID.
    const user = await User.findOne({ email: session.user.email }).select("_id")
    if (!user) {
      return NextResponse.json({ success: false, message: "Your account could not be found. Please sign out and sign in again." }, { status: 401 })
    }
    const room = await Room.findById(data.roomId)
    if (!room || !room.isAvailable) {
      return NextResponse.json({ success: false, message: "Room is no longer available. Please choose another room." }, { status: 409 })
    }
    const booking = await Booking.create(buildBooking(data, user._id, room))
    await Room.findByIdAndUpdate(room._id, { isAvailable: false })
    return NextResponse.json({ success: true, data: booking, message: "Booking created successfully" }, { status: 201 })
  } catch (error) {
    if (error instanceof BookingInputError || error.name === "ValidationError" || error.name === "CastError") {
      const message = error instanceof BookingInputError ? error.message : "Please check your booking details and try again."
      return NextResponse.json({ success: false, message }, { status: 400 })
    }
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: "A conflicting booking already exists. Please refresh and try again." }, { status: 409 })
    }
    console.error("Booking creation failed:", { name: error.name, code: error.code, message: error.message })
    return NextResponse.json({ success: false, message: "Unable to save your booking right now. Please try again shortly." }, { status: 500 })
  }
}
