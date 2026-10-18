// import mongoose, { Schema, models } from "mongoose"

// const foodSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     category: {
//       type: String,
//       required: true,
//       enum: ["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages", "Desserts"],
//     },
//     image: {
//       type: String,
//       required: true,
//     },
//     isAvailable: {
//       type: Boolean,
//       default: true,
//     },
//     ingredients: {
//       type: [String],
//       default: [],
//     },
//   },
//   { timestamps: true },
// )

// const Food = models.Food || mongoose.model("Food", foodSchema)
// export default Food





import mongoose, { Schema, models } from "mongoose"

const foodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages", "Desserts"],
    },
    image: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    ingredients: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
)

const Food = models.Food || mongoose.model("Food", foodSchema)
export default Food
