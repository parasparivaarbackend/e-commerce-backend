import mongoose, { Schema } from "mongoose";

const products = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sub_category: {
      type: Schema.Types.ObjectId,
      ref: "subCategory",
      required: true,
    },
    sub_inner_category: {
      type: Schema.Types.ObjectId,
      ref: "subInnerCategory",
      required: true,
    },
    ActualWeight:{
      type :Number,
      required:[true,"weight in kilogram"]
    },
    SGST: {
      type: Number,
      required: true,
      default: 9,
    },
    CGST: {
      type: Number,
      required: true,
      default: 9,
    },
    IGST: {
      type: Number,
      required: true,
      default: 18,
    },
    local_charges: {
      type: Number,
      trim: true,
      required: true,
    },
    zonal_charges: {
      type: Number,
      trim: true,
      required: true,
    },
    national_charges: {
      type: Number,
      trim: true,
      required: true,
    },
    local_deadline: {
      type: Number,
      trim: true,
      required: true,
    },
    zonal_deadline: {
      type: Number,
      trim: true,
      required: true,
    },
    national_deadline: {
      type: Number,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model("Product", products);
