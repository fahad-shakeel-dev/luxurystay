// import { NextResponse } from "next/server"
// import Order from "@/models/Order"
// import { connectDb } from "@/helper/db"

// export async function GET() {
//   try {
//     await connectDb()
//     const orders = await Order.find({})
//       .populate("userId", "name email phone")
//       .populate("bookingId", "roomId guestName")
//       .populate("items.foodId", "name price category")
//     return NextResponse.json({
//       success: true,
//       data: orders,
//     })
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Error fetching orders",
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
//     const order = await Order.create(data)
//     return NextResponse.json(
//       {
//         success: true,
//         data: order,
//         message: "Order created successfully",
//       },
//       { status: 201 },
//     )
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Error creating order",
//         error: error.message,
//       },
//       { status: 500 },
//     )
//   }
// }



import { NextResponse } from "next/server"
import Order from "@/models/Order"
import { connectDb } from "@/helper/db"

export async function GET() {
  try {
    await connectDb()
    const orders = await Order.find({})
      .populate("userId", "name email phone")
      .populate("bookingId", "roomId guestName")
      .populate("items.foodId", "name price category")
    return NextResponse.json({
      success: true,
      data: orders,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching orders",
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
    const order = await Order.create(data)
    return NextResponse.json(
      {
        success: true,
        data: order,
        message: "Order created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error creating order",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
