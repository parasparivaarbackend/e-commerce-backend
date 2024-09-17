import mongoose, { Schema } from "mongoose";

export const images = new Schema(
  {
    image_url: {
      type: String,
      required: true,
    },
    image_id: {
      type: String,
      required: true,
    },
  }
);
