import mongoose, { Schema } from "mongoose";

const sub_category = new Schema(
  {
    sub_category_name: {
      type: String,
      required: true,
    },
    parent_category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);
export const subCategoryModel = mongoose.model("subCategory", sub_category);
