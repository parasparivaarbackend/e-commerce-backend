import dotenv from "dotenv";
import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";
import { TrackModel } from "../model/treckOrder.model.js";
import { GenerateToken } from "../helper/BlueDartToken.js";
import { ProductModel } from "../model/products.model.js";
import { orderModel } from "../model/order.model.js";
import { SendMailTemplate } from "../utils/EmailHandler.js";

dotenv.config();

const profile = {
  LoginID: process.env.BLUE_DART_LoginID,
  Api_type: "S",
  LicenceKey: process.env.BLUE_DART_LicenceKey,
};

export const createWaybill = asyncHandler(async (req, res) => {
  const data = req.body;
  console.log("inside waybill", data);

  const date = new Date();
  const PickupDate = `/Date(${date.getTime()})/`;
  const token = await GenerateToken();
  if (!token)
    return res
      .status(500)
      .json({ message: "failed to generate bluedartToken" });

  try {
    let itemDetails = [];
    let totalWeight = 0;
    let totalQuantity = 0;

    for (const product of data?.products) {
      const productData = await ProductModel.findById(product?.product_id);
      totalWeight += productData?.ActualWeight * product?.quantity;
      totalQuantity += product?.quantity;
      const abc = {
        ProductName: productData?.title,
        Quantity: product?.quantity,
        Weight: productData?.ActualWeight,
      };
      itemDetails.push(abc);
    }
    // console.log("itemDetails", itemDetails);
    // console.log("totalWeight", totalWeight);
    // console.log("totalQuantity", totalQuantity);

    const options = {
      method: "POST",
      url: "https://apigateway-sandbox.bluedart.com/in/transportation/waybill/v1/GenerateWayBill",
      headers: {
        "content-type": "application/json",
        JWTToken: token,
      },
      data: {
        Request: {
          Consignee: {
            ConsigneeAddress1: "Test Cngee Addr1",
            ConsigneeAddress2: "Test Cngee Addr2",
            ConsigneeAddress3: "Test Cngee Addr3",
            ConsigneeAddressType: "R",
            ConsigneeAttention: "ABCD",
            ConsigneeEmailID: "",
            ConsigneeGSTNumber: "",
            ConsigneeLatitude: "",
            ConsigneeLongitude: "",
            ConsigneeMaskedContactNumber: "",
            ConsigneeMobile: 9995554441,
            ConsigneeName: "Test Consignee Name",
            ConsigneePincode: 122002,
            ConsigneeTelephone: "",
          },
          Returnadds: {
            ManifestNumber: "",
            ReturnAddress1: "Test RTO Addr1",
            ReturnAddress2: "Test RTO Addr2",
            ReturnAddress3: "Test RTO Addr3",
            ReturnContact: "Test RTO",
            ReturnEmailID: "",
            ReturnLatitude: "",
            ReturnLongitude: "",
            ReturnMaskedContactNumber: "",
            ReturnMobile: 9995554447,
            ReturnPincode: 122002,
            ReturnTelephone: "",
          },
          Services: {
            AWBNo: "",
            ActualWeight: totalWeight,
            CollectableAmount: 0,
            Commodity: {},
            CreditReferenceNo: data?.orderId,
            DeclaredValue: 0,
            Dimensions: [],
            PDFOutputNotRequired: true,
            PackType: "",
            PickupDate: PickupDate,
            PickupTime: "1600",
            PieceCount: 1,
            ProductCode: "D",
            ProductType: 0,
            RegisterPickup: true,
            SpecialInstruction: "",
            SubProductCode: "",
            OTPBasedDelivery: 0,
            OTPCode: "",
            itemdtl: itemDetails || [],
            noOfDCGiven: 0,
          },
          Shipper: {
            CustomerAddress1: data?.UserAddress1,
            CustomerAddress2: "Test Cust Addr2",
            CustomerAddress3: "Test Cust Addr3",
            CustomerCode: "246525",
            CustomerEmailID: data?.UserEmail,
            CustomerGSTNumber: "",
            CustomerLatitude: "",
            CustomerLongitude: "",
            CustomerMaskedContactNumber: "",
            CustomerMobile: data?.UserPhone,
            CustomerName: data?.UserName,
            CustomerPincode: data?.Pincode,
            CustomerTelephone: data?.userPhone2,
            IsToPayCustomer: false,
            OriginArea: "DEL",
            Sender: "TestRvp",
            VendorCode: "",
          },
        },
        Profile: profile,
      },
    };

    // console.log("here", options);
    // console.log("Consignee", options?.data?.Request?.Consignee);
    // console.log("Returnadds", options?.data?.Request?.Returnadds);
    // console.log("Services", options?.data?.Request?.Services);
    // console.log("Shipper", options?.data?.Request?.Shipper);

    const resp = await axios.request(options);
    // console.log("resp", resp?.data);
    // console.log("resp", resp?.data?.GenerateWayBillResult?.Status);

    const trackDetail = {
      trackingID: resp?.data?.GenerateWayBillResult?.AWBNo,
      TokenNumber: resp?.data?.GenerateWayBillResult?.TokenNumber,
      PickupDate: PickupDate,
    };
    for (const product of data?.products) {
      await orderModel.findByIdAndUpdate(
        { _id: product?._id },
        { trackDetail: trackDetail }
      );
    }

    const resp2 = await TrackModel.create({
      ...trackDetail,
      user_id: req?.user._id,
      PickupDate,
    });

    const item = { email: data?.UserEmail, Sub: "Order Confirmation" };
    const template = {
      url: "order.ejs",
      userName: data.UserName,
    };

    res
      .status(200)
      .json({ message: "waybill Generated Succesfully", data: resp2 });

    await SendMailTemplate(item, template);

    return;
  } catch (error) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
      return res.status(400).json({ message: "failed to generate waybill" });
    } else if (error.request) {
      console.error("Error request:", error.request);
      return res.status(400).json({ message: "failed to generate waybill" });
    } else {
      console.error("Error message:", error.message);
      return res.status(400).json({ message: "failed to generate waybill" });
    }
  }
});

export const CancelPickup = asyncHandler(async (req, res) => {
  const token = await GenerateToken();
  const data = req.body;
  if (!token)
    return res.status(500).json({ error: "Failed to generate BlueDart token" });

  var options = {
    method: "POST",
    url: "https://apigateway-sandbox.bluedart.com/in/transportation/waybill/v1/CancelWaybill",
    headers: { "content-type": "application/json", JWTToken: token },
    data: {
      Request: { AWBNo: `${data?.AWBNo}` },
      profile: profile,
    },
  };
  try {
    const resp = await axios.request(options);
    return res.status(200).json({ resp });
  } catch (error) {
    console.error("Error in CancelPickup:", error.message);
    return res
      .status(error.response?.status || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

export const TrackingShipment = asyncHandler(async (req, res) => {
  const data = req.body;
  const token = await GenerateToken();
  const options = {
    method: "GET",
    url: "https://apigateway-sandbox.bluedart.com/in/transportation/tracking/v1/shipment",
    params: {
      handler: "tnt",
      action: "custawbquery",
      loginid: process.env.BLUE_DART_LoginID,
      numbers: data?.AWBNo,
      format: "json",
      lickey: process.env.BLUE_DART_LicenceKey,
      verno: "1",
      scan: "1",
      awb: "awb",
    },
    headers: {
      JWTToken: token,
    },
  };
  try {
    const resp = await axios.request(options);
    console.log("resp", resp);
    return res
      .status(200)
      .json({ data: resp?.data, message: "Tracking detail of the product" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
