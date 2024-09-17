import mongoose, { Schema } from "mongoose";

const sub_inner_category = new Schema(
  {
    sub_inner_category_name: {
      type: String,
      required: true,
    },
    parent_category1: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    parent_category2: {
      type: Schema.Types.ObjectId,
      ref: "subCategory",
      required: true,
    },
  },
  { timestamps: true }
);
export const subInnerCategoryModel = mongoose.model(
  "subInnerCategory",
  sub_inner_category
);
