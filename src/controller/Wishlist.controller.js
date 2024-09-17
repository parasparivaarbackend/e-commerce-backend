import { wishlistModel } from "../model/wishlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const CreateWishlist = asyncHandler(async (req, res) => {
  const data = req.body;

  if (!data.product_id) {
    return res.status(400).json({
      message: "product is requierd",
    });
  }
  const find = await wishlistModel.find({
    product_id: data.product_id,
    product_detail_id: data.product_detail_id,
    user_id: req.user?._id,
  });
  if (find.length > 0) {
    return res.status(400).json({
      message: "Item already exist in wishlist",
    });
  }

  await wishlistModel.create({
    ...data,
    user_id: req.user?._id,
  });

  return res.status(201).json({
    message: "Add Item in Wishlist",
  });
});

const getWishlist = asyncHandler(async (req, res) => {
  const data = await wishlistModel
    .find({ user_id: req.user._id })
    .populate({
      path: "product_id",
      select:
        "-description -category -sub_category -sub_inner_category -local_charges -zonal_charges -national_charges -local_deadline -zonal_deadline -national_deadline -products_details -createdAt -updatedAt",
    })
    .populate({
      path: "product_detail_id",
      select: "-selling_quantity -createdAt -updatedAt",
    })
    .select("-createdAt -updatedAt");

  return res.status(200).json({
    message: "data",
    data,
  });
});

const deleteWishlist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const find = await wishlistModel.findById(id);

  if (!find) {
    return res.status(400).json({
      message: "data is not exist ",
    });
  }
  await wishlistModel.findByIdAndDelete(id);
  return res.status(200).json({
    message: "item remove from wishlist",
  });
});

export { CreateWishlist, getWishlist, deleteWishlist };
