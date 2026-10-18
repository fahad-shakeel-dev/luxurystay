// import { NextResponse } from "next/server"
// import Room from "@/models/Room"
// import { connectDb } from "@/helper/db"

// export async function GET() {
//   try {
//     await connectDb()
//     const rooms = await Room.find({})
//     return NextResponse.json({
//       success: true,
//       data: rooms,
//     })
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Error fetching rooms",
//         error: error.message,
//       },
//       { status: 500 },
//     )
//   }
// }

// export async function POST(req) {
//   try {
//     await connectDb()
//     const data = await req.json()
//     const room = await Room.create(data)
//     return NextResponse.json(
//       {
//         success: true,
//         data: room,
//         message: "Room created successfully",
//       },
//       { status: 201 },
//     )
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Error creating room",
//         error: error.message,
//       },
//       { status: 500 },
//     )
//   }
// }

import { NextResponse } from "next/server"
import Room from "@/models/Room"
import { connectDb } from "@/helper/db"

export async function GET() {
  try {
    await connectDb()
    const rooms = await Room.find({}).sort({ roomNumber: 1 }).lean()
    return NextResponse.json({
      success: true,
      data: rooms,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching rooms",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(req) {
  try {
    await connectDb()
    const data = await req.json()
    const room = await Room.create(data)
    return NextResponse.json(
      {
        success: true,
        data: room,
        message: "Room created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error creating room",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
