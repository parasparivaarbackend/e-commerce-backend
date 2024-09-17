// local import
import mongoose, { Schema } from "mongoose";
import { images } from "./Images.model.js";

const ProductDetail = new Schema(
  {
    product_id:{
      type:Schema.Types.ObjectId,
      ref:"Product",
      required:true
    },
    Size: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    image: {
      type: [images],
    },
    MRP: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    selling_quantity: {
      type: String,
      required: true,
    },
    inStock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const ProductDetailModel = mongoose.model(
  "ProductDetail",
  ProductDetail
);
