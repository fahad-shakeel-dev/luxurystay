import mongoose from "mongoose"
const { Schema, models } = mongoose

const roomSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    roomType: {
      type: String,
      required: true,
      enum: ["Single", "Double", "Suite", "Deluxe", "Presidential"],
    },
    price: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const Room = models.Room || mongoose.model("Room", roomSchema)
export default Room
