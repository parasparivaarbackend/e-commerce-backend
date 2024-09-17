import mongoose, { Schema } from "mongoose";
import { images } from "./Images.model.js";

const shortBanner = new Schema(
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

export const shortBannerModel = mongoose.model("shortBanner", shortBanner);
