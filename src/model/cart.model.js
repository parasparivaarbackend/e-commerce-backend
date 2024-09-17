import mongoose, { Schema } from "mongoose";

const cart = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productDetails: {
      type: Schema.Types.ObjectId,
      ref: "ProductDetail",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
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

export const cartModel = mongoose.model("Cart", cart);
