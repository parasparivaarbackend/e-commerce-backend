import { reviewModel } from "../model/review.model.js";
import { ImageUpload, deleteImage } from "../utils/ImageHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const CreateReview = asyncHandler(async (req, res) => {
  const data = req.body;
  const files = req.files;

  const find = await reviewModel.find({
    product_id: data.product_id,
    user_id: req.user?._id,
  });
  if (find.length > 0) {
    return res.status(400).json({ message: "Review already exist" });
  }
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

  const Create = await reviewModel.create({
    ...data,
    user_id: req.user?._id,
    image: uploadedImages,
  });
  return res.status(201).json({
    message: "Review Send",
    data: Create,
  });
});

const GetReview = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const data = await reviewModel.find({ user_id: _id });

  return res.status(200).json({
    message: "Review Get Successful",
    data,
  });
});

const DeleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const find = await reviewModel.findById(id);

  if (!find) {
    return res.status(403).json({ message: "review do not exist" });
  }

  const files = find?.image;

  for (const file of files) {
    await deleteImage(file?.image_id);
  }

  await reviewModel.findByIdAndDelete(id);

  return res.status(200).json({
    message: "Review delete Successful",
  });
});

export { CreateReview, DeleteReview, GetReview };
