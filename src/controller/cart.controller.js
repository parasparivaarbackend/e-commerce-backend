import mongoose from "mongoose";
import { cartModel } from "../model/cart.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const AddToCart = asyncHandler(async (req, res) => {
  const { product_id, productDetails, quantity,image } = req.body;

  const find = await cartModel.find({
    product_id,
    productDetails,
    user_id: req.user._id,
  });
  if (find.length > 0) {
    return res.status(400).json({ message: "item already added" });
  }

  await cartModel.create({
    product_id,
    productDetails,
    quantity,
    image,
    user_id: req.user._id,
  });

  res.status(200).json({ message: "item added to cart" });
});

const getCart = asyncHandler(async (req, res) => {
  const find = await cartModel
    .find({ user_id: req.user._id })
    .populate("product_id")
    .populate("productDetails");

  res.status(200).json({ message: "Cart found", data: find });
});

const updateQuantity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  if (!(quantity && quantity > 0))
    return res.status(400).json({ message: "quantity is required" });

  const findData = await cartModel.find({ product_id: id });

  if (!findData) {
    return res.status(400).json({ message: "cannot add items in cart" });
  }

  await cartModel.findByIdAndUpdate(id, { quantity });
  res.status(200).json({ message: "updated quantity successfully" });
});

const RemoveProductFromCart = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const find = await cartModel.findById(id);

  if (!find) {
    return res.status(400).json({ message: "product do not exist in cart" });
  }
  await cartModel.findByIdAndDelete(id);
  res.status(200).json({ message: "item remove succesfully" });
});

const RemoveAllProduct = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const find = await cartModel.find({ user_id: _id });
  if (find) {
    await cartModel.deleteMany({ user_id: _id });
    return res.status(200).json({ message: "cart empty successfully " });
  }
  res.status(400).json({ message: "item do not exist in cart" });
});

export {
  AddToCart,
  RemoveProductFromCart,
  updateQuantity,
  RemoveAllProduct,
  getCart,
};
