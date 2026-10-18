// import { NextResponse } from "next/server"
// import Food from "@/models/Food"
// import { connectDb } from "@/helper/db"

// export async function PUT(req, { params }) {
//   try {
//     await connectDb()
//     const data = await req.json()
//     const food = await Food.findByIdAndUpdate(params.id, data, { new: true })
//     return NextResponse.json({
//       success: true,
//       data: food,
//       message: "Food item updated successfully",
//     })
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Error updating food item",
//         error: error.message,
//       },
//       { status: 500 },
//     )
//   }
// }

// export async function DELETE(req, { params }) {
//   try {
//     await connectDb()
//     await Food.findByIdAndDelete(params.id)
//     return NextResponse.json({
//       success: true,
//       message: "Food item deleted successfully",
//     })
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Error deleting food item",
//         error: error.message,
//       },
//       { status: 500 },
//     )
//   }
// }




import { NextResponse } from "next/server"
import Food from "@/models/Food"
import { connectDb } from "@/helper/db"

export async function PUT(req, { params }) {
  try {
    await connectDb()
    const data = await req.json()
    const food = await Food.findByIdAndUpdate(params.id, data, { new: true })
    return NextResponse.json({
      success: true,
      data: food,
      message: "Food item updated successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating food item",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDb()
    await Food.findByIdAndDelete(params.id)
    return NextResponse.json({
      success: true,
      message: "Food item deleted successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting food item",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
