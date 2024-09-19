import vine from "@vinejs/vine";

import { customError } from "./index.validation.js";

vine.errorReporter = () => new customError();

export const UserSchema = vine.object({
  name: vine.string().minLength(2).maxLength(30),
  email: vine.string().email(),
  phone: vine.string().minLength(10).maxLength(12),
  password: vine.string().minLength(6).maxLength(16),
});

export const ProductSchema = vine.object({
  title: vine.string().minLength(5).maxLength(100),
  description: vine.string().minLength(20),
  category: vine.string().maxLength(50),
  sub_category: vine.string().maxLength(50),
  sub_inner_category: vine.string().maxLength(50),
  local_charges: vine.number(),
  zonal_charges: vine.number(),
  national_charges: vine.number(),
  local_deadline: vine.number(),
  zonal_deadline: vine.number(),
  national_deadline: vine.number(),
});

export const SubInnerCategory = vine.object({
  sub_inner_category_name: vine.string().minLength(3).maxLength(30),
  parent_category1: vine.string().minLength(5),
  parent_category2: vine.string().minLength(5),
});

export const SubCategory = vine.object({
  sub_category_name: vine.string().minLength(3).maxLength(30),
  parent_category: vine.string().minLength(5),
});

export const addressCheck = vine.object({
  fullname: vine.string().minLength(3).maxLength(30),
  phone: vine.string().minLength(10).maxLength(12),
  phone2: vine.string().minLength(10).maxLength(12),
  addressType: vine.string().minLength(3).maxLength(5),
  country: vine.string().minLength(3),
  state: vine.string().minLength(3),
  city: vine.string().minLength(3),
  area: vine.string().minLength(5),
  house_no: vine.string().minLength(1),
  pincode: vine.string().minLength(3),
});

export const ProductDetail = vine.object({
  product_id: vine.string().minLength(3),
  Size: vine.string().minLength(1),
  color: vine.string().minLength(2),
  MRP: vine.number().min(1),
  sellingPrice: vine.number().min(1),
  selling_quantity: vine.number().min(1),
  inStock: vine.number().min(1),
});

export const OrderDetail = vine.object({
  payment_status: vine.string().minLength(3),
  status: vine.string().minLength(3),
});

export const ReturnDetail = vine.object({
  product_id: vine.string().minLength(5),
  product_detail_id: vine.string().minLength(5),
  address_id: vine.string().minLength(5),
  reason: vine.string(),
  upi_account_no: vine.string(),
  qty: vine.number(),
});
