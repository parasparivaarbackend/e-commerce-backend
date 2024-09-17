import { ReturnModel } from "../model/return.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ImageUpload } from "../utils/ImageHandler.js";

const Create = asyncHandler(async (req, res) => {
  const data = req.body;
  const files = req.files;

  let uploadedImages = [];
  if (files || files.length > 0) {
    for (const file of files) {
      try {
        const imageData = await ImageUpload(file);
        uploadedImages.push(imageData);
      } catch (error) {
        return res.status(500).json({
          message: "Error uploading images",
          error: error.message,
        });
      }
    }
  }
  await ReturnModel.create({
    ...data,
    user_id: req.user?._id,
    image: uploadedImages,
  });
  return res.status(201).json({
    message: "Order returned Successful",
  });
});

const Update = asyncHandler(async (req, res) => {
  const { approved } = req.body;
  const { id } = req.params;
  const find = await ReturnModel.findById(id);
  if (!find || find.length < 1) {
    return res.status(400).json({
      message: "Return item not exist",
    });
  }

  await ReturnModel.findByIdAndUpdate(id, { approved }, { new: true });

  return res.status(200).json({
    message: "Return approved successful",
  });
});

const Getdata = asyncHandler(async (req, res) => {
  const { query } = req;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 5;
  const newLimit = limit * (page - 1);
  const data = await ReturnModel.find({})
    .populate("product_id")
    .populate("product_detail_id")
    .populate("address_id")
    .skip(newLimit)
    .limit(limit);
  return res.status(200).json({
    message: "data",
    data,
  });
});

export { Create, Update, Getdata };
