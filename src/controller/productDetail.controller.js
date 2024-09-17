import mongoose from "mongoose";
import { ProductDetailModel } from "../model/ProductDetail.model.js";
import { ProductModel } from "../model/products.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ImageUpload, deleteImage } from "../utils/ImageHandler.js";

const CreateProductDetails = asyncHandler(async (req, res) => {
  const data = req.body;
  const files = req.files;

  let uploadedImages = [];

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

  const Create = await ProductDetailModel.create({
    ...data,
    image: uploadedImages,
  });


  return res.status(201).json({
    message: "Product Details Created Successful",
    data: Create,
  });
});

const AdminGetProductDetails = asyncHandler(async (req, res) => {
  // const { _id } = req.user;
  const { query } = req;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const newLimit = limit * (page - 1);
  const data = await ProductDetailModel.find({}).skip(newLimit).limit(limit);

  return res.status(200).json({
    message: "data",
    data,
  });
});

const DeleteProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const find = await ProductDetailModel.findById(id);

  if (!find) {
    return res.status(403).json({ message: "data is not exist" });
  }

  const files = find?.image;

  for (const file of files) {
    await deleteImage(file?.image_id);
  }

  const findProduct = await ProductModel.findById(find.product_id);

  const update = findProduct.products_details?.filter(
    (item) => new mongoose.Types.ObjectId(item).toHexString() !== id
  );

  await ProductModel.findByIdAndUpdate(find.product_id, {
    products_details: update,
  });

  await ProductDetailModel.findByIdAndDelete(id);

  return res.status(200).json({
    message: "Product Details delete Successful",
  });
});

const UpdateProductDetails = asyncHandler(async (req, res) => {
  const data = req.body;
  // const NewFile = req.files;
  const { id } = req.params;

  const find = await ProductDetailModel.findById(id);
  if (!find) {
    return res.status(404).json({
      message: "Product details is not exist",
    });
  }

  // let uploadedImages = [];

  // if (NewFile || NewFile?.length > 0) {
  //   const files = find?.image;

  //   for (const file of files) {
  //     await deleteImage(file?.image_id);
  //   }

  //   for (const file of NewFile) {
  //     try {
  //       const imageData = await ImageUpload(file);
  //       uploadedImages.push(imageData);
  //     } catch (error) {
  //       return res.status(500).json({
  //         message: "Error uploading images",
  //         error: error.message,
  //       });
  //     }
  //   }
  // }

  await ProductDetailModel.findByIdAndUpdate(id, data);
  return res.status(200).json({
    message: "Product Details update Successful",
  });
});

export {
  CreateProductDetails,
  AdminGetProductDetails,
  DeleteProductDetails,
  UpdateProductDetails,
};
