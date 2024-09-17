import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { UserModel } from "../model/user.model.js";
import { SendMail } from "../utils/EmailHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ImageUpload, deleteImage } from "../utils/ImageHandler.js";

dotenv.config();

let emailToOTP = new Object();

const Generatetoken = async (data) => {
  return jwt.sign({ id: data._id, email: data.email }, process.env.SECRET_KEY);
};

const createUser = asyncHandler(async (req, res) => {
  const data = req.body;

  const findUser = await UserModel.findOne({ email: data.email });

  if (findUser) {
    return res.status(400).json({
      message: "Email already exist",
    });
  }

  const Create = await UserModel.create(data);
  Create.password = null;

  const token = await Generatetoken(Create);

  return res.status(201).json({
    message: "User register successful",
    data: Create,
    token,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res.status(400).json({
      message: `${!email ? "email is required" : !password && "password is required"}`,
    });
  }

  const findUser = await UserModel.findOne({
    $or: [{ email: email }, { phone: email }],
  });

  if (!findUser) {
    return res.status(404).json({
      message: "User not exist",
    });
  }

  const check = await findUser?.Checkpassword(password);

  if (!check) {
    return res.status(404).json({
      message: "Wrong Password",
    });
  }

  findUser.password = null;

  const token = await Generatetoken(findUser);

  return res.status(200).json({
    message: "Login Successful",
    data: findUser,
    token,
  });
});

const SendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const find = await UserModel.findOne({ email });
  if (!find) {
    return res.status(400).json({
      message: "User not exist",
    });
  }
  const OTP = Math.floor(1000 + Math.random() * 9000);
  const expire = Date.now() + 1000 * 60 * 5;
  emailToOTP[email] = { OTP, expire };

  const ChangePasswordOtp = {
    email,
    expire,
    Sub: "Reset password",
    text: `your requested otp reset ,please do not share otp \n ${OTP}  \n otp is valid 5 min `,
  };
  SendMail(ChangePasswordOtp);

  return res.status(200).json({
    message: "OTP Sent",
  });
});

const CheckOtp = asyncHandler(async (req, res) => {
  const { check_otp, email } = req.body;

  const data = emailToOTP[email];

  if (data.expire < Date.now()) {
    return res.status(403).json({
      message: "OTP Expire",
    });
  }

  if (check_otp !== data.OTP) {
    return res.status(400).json({
      message: "Invalid otp",
    });
  }

  return res.status(200).json({
    message: "verify",
    redirect: true,
  });
});

const newPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const find = await UserModel.findOne({ email });

  find.password = password;
  await find.save();

  delete emailToOTP[email];

  return res.status(200).json({
    message: "password Created successful",
  });
});

const CrateNewPassword = asyncHandler(async (req, res) => {
  const { oldpassword, newPassword } = req.body;

  const find = await UserModel.findById(req.user?._id);

  const result = await find.Checkpassword(oldpassword);
  if (!result) {
    return res.status(400).json({
      messages: "Old Password is Wrong",
    });
  }

  find.password = newPassword;
  await find.save();

  return res.status(200).json({
    message: "New Password Created",
  });
});

const Profile = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({
      message: "Image is required",
    });
  }

  const oldFile = req?.user?.profile_image?.image_id;
  if (oldFile) {
    await deleteImage(oldFile);
  }

  const data = await ImageUpload(file);
  const update = await UserModel.findByIdAndUpdate(req.user?._id, {
    profile_image: data,
  });
  return res.status(200).json({
    message: "Profile uploaded successful",
  });
});

const GetOrder = asyncHandler(async (req, res) => {
  const data = await UserModel.aggregate([
    {
      $match: {
        _id: req.user._id,
      },
    },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "user_id",
        as: "UserOrder",
        pipeline: [
          {
            $lookup: {
              from: "products",
              localField: "product_id",
              foreignField: "_id",
              as: "Product",
              pipeline: [
                {
                  $project: {
                    title: 1,
                    description: 1,
                    local_charges: 1,
                    zonal_charges: 1,
                    national_charges: 1,
                    local_deadline: 1,
                    zonal_deadline: 1,
                    national_deadline: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "productdetails",
              localField: "product_detail_id",
              foreignField: "_id",
              as: "ProductDetails",
              pipeline: [
                {
                  $project: {
                    Size: 1,
                    color: 1,
                    MRP: 1,
                    sellingPrice: 1,
                    selling_quantity: 1,
                    inStock: 1,
                    image: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "addresses",
              localField: "address_id",
              foreignField: "_id",
              as: "UserAddress",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    phone: 1,
                    phone2: 1,
                    country: 1,
                    state: 1,
                    city: 1,
                    area: 1,
                    house_no: 1,
                    pincode: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              payment_status: 1,
              status: 1,
              createdAt: 1,
              Product: 1,
              ProductDetails: 1,
              UserAddress: 1,
              image: 1,
              quantity: 1,
              razorpay_order_id: 1,
              payment_type: 1,
              trackDetail: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        UserOrder: 1,
      },
    },
  ]).sort({ _id: -1 });
  return res.status(200).json({
    message: "order",
    data,
  });
});

const getAllUserByAdmin = asyncHandler(async (req, res) => {
  const { query } = req;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const newLimit = limit * (page - 1);
  const data = await UserModel.find({}).skip(newLimit).limit(limit);
  const data2 = await UserModel.find({}).countDocuments();

  return res.status(200).json({
    message: "All user Data",
    data,
    totalUsers: data2,
  });
});

export {
  createUser,
  loginUser,
  SendOtp,
  CheckOtp,
  newPassword,
  CrateNewPassword,
  Profile,
  GetOrder,
  getAllUserByAdmin,
};
