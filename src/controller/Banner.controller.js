import { bannerModel } from "../model/banner.model.js";
import { ImageUpload, deleteImage } from "../utils/ImageHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBanner = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file || file.length === 0) {
    return res.status(400).json({
      message: "file is required",
    });
  }

  const data = await ImageUpload(file);
  await bannerModel.create({ user_id: req.user?._id, image: data });
  return res.status(200).json({
    message: "Banner uploaded Successful",
  });
});

const getBanner = asyncHandler(async (req, res) => {
  const find = await bannerModel.find({});
  if (!find) {
    return res.status(400).json({
      message: "Banner not found",
    });
  }
  return res.status(200).json({
    message: "Banner found",
    data: find,
  });
});

const getAdminBanner = asyncHandler(async (req, res) => {
  const find = await bannerModel.find({ user_id: req?.user._id });
  if (!find) {
    return res.status(400).json({
      message: "Banner not found",
    });
  }
  return res.status(200).json({
    message: "Banner found",
    data: find,
  });
});

const DeleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const find = await bannerModel.findById(id);

  if (!find) {
    return res.status(400).json({
      message: "Banner not exist",
    });
  }
  await deleteImage(find?.image?.image_id);
  await bannerModel.findByIdAndDelete(id);
  return res.status(200).json({
    message: "Banner deleted successful",
  });
});

export { createBanner, DeleteBanner, getBanner, getAdminBanner };
