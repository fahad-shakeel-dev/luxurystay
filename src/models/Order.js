// import mongoose, { Schema, models } from "mongoose"

// const orderSchema = new Schema(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     bookingId: {
//       type: Schema.Types.ObjectId,
//       ref: "Booking",
//       required: true,
//     },
//     items: [
//       {
//         foodId: {
//           type: Schema.Types.ObjectId,
//           ref: "Food",
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//           min: 1,
//         },
//         price: {
//           type: Number,
//           required: true,
//         },
//       },
//     ],
//     totalAmount: {
//       type: Number,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "preparing", "ready", "delivered", "cancelled"],
//       default: "pending",
//     },
//     deliveryAddress: {
//       type: String,
//       required: true,
//     },
//     specialInstructions: {
//       type: String,
//       default: "",
//     },
//   },
//   { timestamps: true },
// )

// const Order = models.Order || mongoose.model("Order", orderSchema)
// export default Order




import mongoose, { Schema, models } from "mongoose"

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    items: [
      {
        foodId: {
          type: Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "delivered", "cancelled"],
      default: "pending",
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    specialInstructions: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
)

const Order = models.Order || mongoose.model("Order", orderSchema)
export default Order
