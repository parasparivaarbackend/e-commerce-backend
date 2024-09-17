import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { asyncHandler } from "../utils/asyncHandler.js";
import { UserModel } from "../model/user.model.js";

dotenv.config();

export const Authontication = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");

    const { id } = jwt.verify(token, process.env.SECRET_KEY);
    const findUser = await UserModel.findById(id).select("-password");
    if (!findUser) {
      return res.status(404).json({
        message: "invalid credential",
      });
    }
    req.user = findUser;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorize",
    });
  }
});
