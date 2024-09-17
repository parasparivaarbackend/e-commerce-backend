import { addressModel } from "../model/address.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addAddress = asyncHandler(async (req, res) => {
  const data = req.body;
  const id = req.user._id;

  const result = await addressModel.create({ user_id: req.user._id, ...data });
  res.status(200).json({
    message: "address created successful",
    result,
  });
});

const getAddress = asyncHandler(async (req, res) => {
  const data = await addressModel.find({ user_id: req.user._id });

  res.status(200).json({
    message: "address found",
    data,
  });
});

const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const find = await addressModel.findById(id);
  if (!find) {
    return res.status(400).json({
      message: "address not found",
    });
  }
  const result = await addressModel.findByIdAndUpdate(id, data);
  res.status(200).json({
    message: "address updated successful",
  });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const find = await addressModel.findById(id);
  if (!find) {
    return res.status(400).json({
      message: "address not found",
    });
  }
  const result = await addressModel.findByIdAndDelete(id);
  res.status(200).json({
    message: "address deleted successful",
  });
});

export { addAddress, getAddress, updateAddress, deleteAddress };
