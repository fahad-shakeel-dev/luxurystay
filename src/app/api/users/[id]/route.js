import { NextResponse } from "next/server"
import User from "@/models/User"
import { connectDb } from "@/helper/db"

export async function PUT(req, { params }) {
  try {
    await connectDb()
    const data = await req.json()
    const user = await User.findByIdAndUpdate(params.id, data, { new: true })
    return NextResponse.json({
      success: true,
      data: user,
      message: "User updated successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating user",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDb()
    await User.findByIdAndDelete(params.id)
    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting user",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
