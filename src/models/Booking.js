// import mongoose, { Schema, models } from "mongoose"

// const bookingSchema = new Schema(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     roomId: {
//       type: Schema.Types.ObjectId,
//       ref: "Room",
//       required: true,
//     },
//     guestName: {
//       type: String,
//       required: true,
//     },
//     guestPhone: {
//       type: String,
//       required: true,
//     },
//     guestEmail: {
//       type: String,
//       required: true,
//     },
//     checkInDate: {
//       type: Date,
//       required: true,
//     },
//     checkOutDate: {
//       type: Date,
//       required: true,
//     },
//     numberOfGuests: {
//       type: Number,
//       required: true,
//     },
//     totalAmount: {
//       type: Number,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected", "completed"],
//       default: "pending",
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["pending", "paid", "refunded"],
//       default: "pending",
//     },
//     specialRequests: {
//       type: String,
//       default: "",
//     },
//   },
//   { timestamps: true },
// )

// const Booking = models.Booking || mongoose.model("Booking", bookingSchema)
// export default Booking


import mongoose, { Schema, models } from "mongoose"

const bookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    guestName: {
      type: String,
      required: true,
    },
    guestPhone: {
      type: String,
      required: true,
    },
    guestEmail: {
      type: String,
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    specialRequests: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
)

const Booking = models.Booking || mongoose.model("Booking", bookingSchema)
export default Booking
