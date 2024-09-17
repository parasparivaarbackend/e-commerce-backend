// local import
import mongoose, { Schema } from "mongoose";

const order = new Schema(
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
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    address_id: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    charges: {
      type: Number,
    },
    payment_type: {
      type: String,
      required: true,
    },
    // total_price: {
    //   type: Number,
    // },
    payment_status: {
      type: String,
      default: "pending",
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    trackDetail: [{
      trackingID: { type: String },
      TokenNumber: { type: String },
      PickupDate: { type: String }
    }]
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("Order", order);
