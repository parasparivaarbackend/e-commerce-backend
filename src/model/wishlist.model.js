import mongoose, { Schema } from "mongoose";

const wishlist = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    product_detail_id: {
      type: Schema.Types.ObjectId,
      ref: "ProductDetail",
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
export const wishlistModel = mongoose.model("Wishlist", wishlist);
