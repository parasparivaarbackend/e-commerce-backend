import mongoose, { Schema } from "mongoose";
import { images } from "./Images.model.js";

const returnSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    address_id: {
      // Corrected to lowercase 'a'
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    image: {
      type: [images],
    },
    approved: {
      type: Boolean,
    },
    reason: {
      type: String,
      required: true,
    },
    upi_account_no: {
      type: String,
    },
    qty: {
      type: Number,
      required: true,
    },
   description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const ReturnModel = mongoose.model("Return", returnSchema);
