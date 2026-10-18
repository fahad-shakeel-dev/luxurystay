import { NextResponse } from "next/server"
import Food from "@/models/Food"
import { connectDb } from "@/helper/db"

export async function GET() {
  try {
    await connectDb()
    const food = await Food.find({})
    return NextResponse.json({
      success: true,
      data: food,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching food items",
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
    const food = await Food.create(data)
    return NextResponse.json(
      {
        success: true,
        data: food,
        message: "Food item created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error creating food item",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
