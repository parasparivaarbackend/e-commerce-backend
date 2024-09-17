import axios from "axios";
import dotenv from "dotenv";
import { cartModel } from "../model/cart.model.js";
import { orderModel } from "../model/order.model.js";
import { ProductDetailModel } from "../model/ProductDetail.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { GenerateToken } from "../helper/BlueDartToken.js";

dotenv.config();

export const LocationFinder = asyncHandler(async (req, res) => {

  const pincode = req.body.pincode; // Ensure `pincode` is extracted from request body
  const token = await GenerateToken();

  const options = {
    method: 'POST',
    url: 'https://apigateway-sandbox.bluedart.com/in/transportation/finder/v1/GetServicesforPincode',
    headers: {
      'content-type': 'application/json',
      JWTToken: token
    },
    data: {
      pinCode: pincode,
      profile: {
        LoginID: process.env.BLUE_DART_LoginID,
        Api_type: 'S',
        LicenceKey: process.env.BLUE_DART_LicenceKey
      }
    }
  };

  try {
    const response = await axios.request(options);
    if (response) {
      res.status(200).json({ IsError: response?.data?.GetServicesforPincodeResult.IsError, AreaCode: response?.data?.GetServicesforPincodeResult?.AreaCode });
    }

  } catch (error) {
    res.status(200).json({ error: "pincode do not exist or delivery is not available", IsError: true });
  }
});

const CreateOrder = asyncHandler(async (req, res) => {
  const data = req.body;
  let CartData = [];
  if (data.cartId) {
    for (const cart of data.cartId) {
      const data = await cartModel.findById(cart.id);
      CartData.push({
        ...data,
        charges: cart.charges,
        image: cart.image,
        quantity: cart.quantity,
      });
      await cartModel.findByIdAndDelete(cart.id);
    }
  }

  const CartOrder = CartData.map((item) => ({
    user_id: req.user?._id,
    product_id: item._doc.product_id,
    product_detail_id: item._doc.productDetails,
    address_id: data.address_id,
    image: item.image,
    quantity: item.quantity,
    payment_type: data.payment_type,
    payment_status: data.payment_status,
    charges: item.charges,
    razorpay_order_id: data.razorpay_order_id,
    razorpay_payment_id: data.razorpay_payment_id,
    status: data.status,
  }));

  for (let item of CartData) {
    const totalStock = await ProductDetailModel.findById(
      item?._doc?.productDetails
    );
    await ProductDetailModel.findByIdAndUpdate(item?._doc?.productDetails, {
      inStock: totalStock.inStock - item.quantity,
    });
  }

  const Create = await orderModel.create(CartOrder);

  return res.status(201).json({
    message: "Ordered Successful",
    data: Create,
  });
});

const BuyNow = asyncHandler(async (req, res) => {
  const data = req.body;

  const create = await orderModel.create({ ...data, user_id: req.user?._id });

  const totalStock = await ProductDetailModel.findById(data.product_detail_id);

  await ProductDetailModel.findByIdAndUpdate(data.product_detail_id, {
    inStock: totalStock.inStock - data.quantity,
  });

  return res.status(201).json({
    message: "Ordered Successful",
    data: create,

  });
});

const UpdateOrder = asyncHandler(async (req, res) => {
  const { status, payment_status } = req.body;
  const { id } = req.params;

  const find = await orderModel.findById(id);
  if (!find) {
    return res.status(404).json({
      message: "Product is not exist",
    });
  }
  await orderModel.findByIdAndUpdate(id, {
    payment_status: payment_status,
    status: status,
  });
  return res.status(200).json({
    message: `Order ${status} Successful`,
  });
});

const GetAdmin = asyncHandler(async (req, res) => {
  const { query } = req;
  const limit = query.limit || 5;
  const index = query.index || 1;
  const newLimit = limit * index;
  if (req.user.role === "user") {
    return res.status(403).json({
      messages: "Unauthorize ",
    });
  }

  const data = await orderModel
    .aggregate([
      {
        $lookup: {
          from: "products",
          foreignField: "_id",
          localField: "product_id",
          as: "Product",
          pipeline: [
            {
              $lookup: {
                from: "categories",
                foreignField: "_id",
                localField: "category",
                as: "category",
                pipeline: [
                  {
                    $project: {
                      category_name: 1,
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: "subcategories",
                foreignField: "_id",
                localField: "sub_category",
                as: "sub_category",
                pipeline: [
                  {
                    $project: {
                      sub_category_name: 1,
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: "subinnercategories",
                foreignField: "_id",
                localField: "sub_inner_category",
                as: "sub_inner_category",
                pipeline: [
                  {
                    $project: {
                      sub_inner_category_name: 1,
                    },
                  },
                ],
              },
            },
            {
              $project: {
                user_id: 1,
                title: 1,
                description: 1,
                category: 1,
                sub_category: 1,
                sub_inner_category: 1,
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
          charges: 1,
          status: 1,
          Product: 1,
          payment_type: 1,
          payment_status: 1,
          ProductDetails: 1,
          UserAddress: 1,
          createdAt: 1,
        },
      },
    ])
    .limit(newLimit)
    .sort({ _id: -1 });

  return res.status(200).json({
    message: "orders",
    data,
  });
});

const GetAdminDashboardData = asyncHandler(async (req, res) => {
  const data = await orderModel.aggregate([{
    $lookup: {
      from: "productdetails", foreignField: "_id", localField: "product_detail_id", as: "ProductDetails",
      pipeline: [{
        $project: {
          sellingPrice: 1
        }
      }]
    }
  }])

  const newData = []
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  data.map((item) => {
    if (item.payment_status === "success" && item.status != "returned" && item.status != "cancelled") {
      const date = new Date(item.createdAt)
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const formattedDate = `${month}-${year}`;
      newData.push({ "sale": item.quantity * item.ProductDetails[0].sellingPrice, "month": formattedDate })
    }
  })
  const dashboard = newData.reduce((acc, curr) => {
    if (acc[curr.month]) {
      acc[curr.month] += curr.sale;
    } else {
      acc[curr.month] = curr.sale;
    }
    return acc;
  }, {});
  let dashboardRevenue = { "label": [], "revenue": [] };
  for (const key in dashboard) {
    dashboardRevenue.label.push(key)
    dashboardRevenue.revenue.push(dashboard[key])
  }

  let booking = 0, cancelled = 0, delivered = 0, returned = 0;

  data.map((item) => {
    if (item.status === "cancelled") cancelled++;
    if (item.status === "delivered") delivered++;
    if (item.status === "pending") booking++;
    if (item.status === "returned") returned++;
  })



  res.status(200).json({ message: "All order Data fetch", data: dashboardRevenue, booking, cancelled, delivered, returned })
})


export { CreateOrder, UpdateOrder, GetAdmin, BuyNow, GetAdminDashboardData };
