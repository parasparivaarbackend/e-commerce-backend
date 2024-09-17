import { subInnerCategoryModel } from "../model/sub_inner_category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const Createinnercategory = asyncHandler(async (req, res) => {
  const data = req.body;

  const find = await subInnerCategoryModel.find(data);
  if (find.length > 0) {
    return res.status(400).json({
      message: "Sub Inner category alredy exist",
    });
  }
  await subInnerCategoryModel.create(data);
  return res.status(200).json({
    message: "Sub inner Category created successful",
  });
});

const GetInnerCategory = asyncHandler(async (req, res) => {
  const { query } = req;
  const limit = Number(query.limit) || 5;
  const page = Number(query.page) || 1;
  const newLimit = limit * (page - 1);
  const data = await subInnerCategoryModel
    .find({})
    .populate("parent_category1")
    .populate("parent_category2").skip(newLimit)
    .limit(limit);
  return res.status(200).json({
    message: "data",
    data,
  });
});

const DeleteInnerCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const find = await subInnerCategoryModel.findById(id);

  if (!find) {
    return res.status(404).json({
      messages: "Sub inner Category is not exist",
    });
  }
  await subInnerCategoryModel.findByIdAndDelete(id);

  return res.status(200).json({
    message: "Sub inner Category Category delete successful",
  });
});

const UpdateInnerCategory = asyncHandler(async (req, res) => {
  const data = req.body;
  const { id } = req.params;

  const find = await subInnerCategoryModel.findById(id);
  if (!find) {
    return res.status(404).json({
      message: "Sub inner Category is not exist",
    });
  }
  await subInnerCategoryModel.findByIdAndUpdate(id, data);
  return res.status(200).json({
    message: "sub inner Category updated successful",
  });
});

export {
  Createinnercategory,
  GetInnerCategory,
  DeleteInnerCategory,
  UpdateInnerCategory,
};
