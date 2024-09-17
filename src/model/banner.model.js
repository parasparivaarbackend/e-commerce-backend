import mongoose, { Schema } from "mongoose";
import { images } from "./Images.model.js";

const banner = new Schema(
  {
    image: {
      type: images,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const bannerModel = mongoose.model("Banner", banner);
