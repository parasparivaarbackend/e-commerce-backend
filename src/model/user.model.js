import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { images } from "./Images.model.js";
import { SALT } from "../constant.js";

const user = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    profile_image: {
      type: images,
    },
  },
  { timestamps: true }
);

user.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, SALT);
  next()
});

user.methods.Checkpassword = async function(password) {
    return this.password = bcrypt.compare(password,this.password)
}

export const UserModel = mongoose.model("User", user);
