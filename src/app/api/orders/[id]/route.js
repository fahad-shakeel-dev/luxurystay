// import { NextResponse } from "next/server"
// import Order from "@/models/Order"
// import { connectDb } from "@/helper/db"

// export async function PUT(req, { params }) {
//   try {
//     await connectDb()
//     const data = await req.json()
//     const order = await Order.findByIdAndUpdate(params.id, data, { new: true })
//     return NextResponse.json({
//       success: true,
//       data: order,
//       message: "Order updated successfully",
//     })
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Error updating order",
//         error: error.message,
//       },
//       { status: 500 },
//     )
//   }
// }




import { NextResponse } from "next/server"
import Order from "@/models/Order"
import { connectDb } from "@/helper/db"

export async function PUT(req, { params }) {
  try {
    await connectDb()
    const data = await req.json()
    const order = await Order.findByIdAndUpdate(params.id, data, { new: true })
    return NextResponse.json({
      success: true,
      data: order,
      message: "Order updated successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating order",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
