import { shortBannerModel } from "../model/shortBanner.model.js";
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
  await shortBannerModel.create({ user_id: req.user?._id, image: data });
  return res.status(200).json({
    message: "Short Banner uploaded Successful",
  });
});

const getBanner = asyncHandler(async (req, res) => {
  const find = await shortBannerModel.find({});
  if (!find) {
    return res.status(400).json({
      message: "Short Banner not found",
    });
  }
  return res.status(200).json({
    message: "Short Banners found",
    data: find,
  });
});

const getAdminBanner = asyncHandler(async (req, res) => {
  const find = await shortBannerModel.find({ user_id: req?.user._id });
  if (!find) {
    return res.status(400).json({
      message: "Short Banner not found",
    });
  }
  return res.status(200).json({
    message: "Short Banner found",
    data: find,
  });
});

const DeleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const find = await shortBannerModel.findById(id);

  if (!find) {
    return res.status(400).json({
      message: "Short Banner not exist",
    });
  }
  await deleteImage(find?.image?.image_id);
  await shortBannerModel.findByIdAndDelete(id);
  return res.status(200).json({
    message: "Short Banner deleted successful",
  });
});

export { createBanner, DeleteBanner, getBanner, getAdminBanner };
