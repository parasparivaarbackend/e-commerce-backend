import mongoose, { Schema } from "mongoose";
import { images } from "./Images.model.js";
const review = new Schema(
  {
    image: {
      type: [images],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
export const reviewModel = mongoose.model("Review", review);
