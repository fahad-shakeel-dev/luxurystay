// import { NextResponse } from "next/server"
// import Room from "@/models/Room"
// import { connectDb } from "@/helper/db"

// export async function PUT(req, { params }) {
//   try {
//     await connectDb()
//     const data = await req.json()
//     const room = await Room.findByIdAndUpdate(params.id, data, { new: true })
//     return NextResponse.json({
//       success: true,
//       data: room,
//       message: "Room updated successfully",
//     })
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Error updating room",
//         error: error.message,
//       },
//       { status: 500 },
//     )
//   }
// }

// export async function DELETE(req, { params }) {
//   try {
//     await connectDb()
//     await Room.findByIdAndDelete(params.id)
//     return NextResponse.json({
//       success: true,
//       message: "Room deleted successfully",
//     })
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Error deleting room",
//         error: error.message,
//       },
//       { status: 500 },
//     )
//   }
// }




import { NextResponse } from "next/server"
import Room from "@/models/Room"
import { connectDb } from "@/helper/db"

export async function PUT(req, { params }) {
  try {
    await connectDb()
    const data = await req.json()
    const room = await Room.findByIdAndUpdate(params.id, data, { new: true })
    return NextResponse.json({
      success: true,
      data: room,
      message: "Room updated successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating room",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDb()
    await Room.findByIdAndDelete(params.id)
    return NextResponse.json({
      success: true,
      message: "Room deleted successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting room",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
