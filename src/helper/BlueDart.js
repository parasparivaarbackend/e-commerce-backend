import dotenv from "dotenv";
import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";

dotenv.config();

const profile = { LoginID: process.env.BLUE_DART_LoginID, Api_type: 'S', LicenceKey: process.env.BLUE_DART_LicenceKey }
const date = new Date();

export const GenerateToken = async () => {
    try {
        const options = {
            method: 'GET',
            url: 'https://apigateway-sandbox.bluedart.com/in/transportation/token/v1/login',
            headers: { ClientID: process.env.BLUE_DART_CLIENT_ID, clientSecret: process.env.BLUE_DART_CLIENT_SECRET }
        };

        const res = await axios.request(options)
        return res.data.JWTToken
    } catch (error) {
        console.log(error)
    }

}


export const LocationFinder = asyncHandler(async (req, res) => {
    try {
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

        const response = await axios.request(options);
        res.status(200).json(response.data.GetServicesforPincodeResult.IsError);

    } catch (error) {
        console.error(error);
    }
});



export const WayBill = async (token, orderId) => {
    try {
        // Setting up request options
        var options = {
            method: 'POST',
            url: 'https://apigateway-sandbox.bluedart.com/in/transportation/waybill/v1/GenerateWayBill',
            headers: {
                'content-type': 'application/json',
                JWTToken: token
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
                        ConsigneePincode: 110027,
                        ConsigneeTelephone: ""
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
                        ReturnPincode: 400057,
                        ReturnTelephone: ""
                    },
                    Services: {
                        AWBNo: "",
                        ActualWeight: 0.5,
                        CollectableAmount: 0,
                        Commodity: {},
                        CreditReferenceNo: orderId, // Added `orderId` parameter here
                        DeclaredValue: 0,
                        Dimensions: [],
                        PDFOutputNotRequired: true,
                        PackType: "",
                        PickupDate: "/Date(1683376344000)/",
                        PickupTime: "1600",
                        PieceCount: 1,
                        ProductCode: "D",
                        ProductType: 0,
                        RegisterPickup: true,
                        SpecialInstruction: "",
                        SubProductCode: "",
                        OTPBasedDelivery: 0,
                        OTPCode: "",
                        itemdtl: [],
                        noOfDCGiven: 0
                    },
                    Shipper: {
                        CustomerAddress1: "Test Cust Addr1",
                        CustomerAddress2: "Test Cust Addr2",
                        CustomerAddress3: "Test Cust Addr3",
                        CustomerCode: "246525",
                        CustomerEmailID: "TestCustEmail@bd.com",
                        CustomerGSTNumber: "",
                        CustomerLatitude: "",
                        CustomerLongitude: "",
                        CustomerMaskedContactNumber: "",
                        CustomerMobile: "9996665554",
                        CustomerName: "Test Cust Name",
                        CustomerPincode: "122002",
                        CustomerTelephone: "",
                        IsToPayCustomer: true,
                        OriginArea: "DEL",
                        Sender: "TestRvp",
                        VendorCode: ""
                    }
                },
                Profile: profile // Added `profile` parameter here
            }
        };

        // Sending the request and receiving response
        const res = await axios.request(options);
        return {
            trackingID: res.data.GenerateWayBillResult.AWBNo,
            TokenNumber: res.data.GenerateWayBillResult.TokenNumber
        };
    } catch (error) {
        console.log(error);
    }
};




export const TrackOrder = async (token, AWBNo) => {
    try {
      
        const options = {
            method: 'GET',
            url: 'https://apigateway-sandbox.bluedart.com/in/transportation/tracking/v1/shipment',
            params: {
                handler: 'tnt', 
                loginid: process.env.BLUE_DART_LoginID,
                numbers: AWBNo, 
                format: 'xml', 
                lickey: process.env.BLUE_DART_LicenceKey,
                action: 'custawbquery', 
                verno: '1', 
                awb: 'awb',
                scan: '1' 
            },
            headers: {
                Accept: 'application/json, text/plain, */*',
                JWTToken: token 
            }
        };
        const response = await axios.request(options);
        console.log("response", response.data);

    } catch (error) {
        if (error.response) {
         
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
         
            console.error('Error request:', error.request);
        } else {
         
            console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
    }
};

export const CancelPickup = async (tokenNumber, token, date) => {

    var options = {
        method: 'POST',
        url: 'https://apigateway-sandbox.bluedart.com/in/transportation/cancel-pickup/v1/CancelPickup',
        headers: { 'content-type': 'application/json', JWTToken: token },
        data: {
            request: {
                PickupRegistrationDate: date,
                Remarks: null,
                TokenNumber: tokenNumber
            },
            profile: { LoginID: process.env.BLUE_DART_LoginID, LicenceKey: process.env.BLUE_DART_LicenceKey, Api_type: 'S' }
        }
    };

    try {
        axios.request(options).then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    } catch (error) {
        console.log(error)
    }
}

// export const TrackOrder = async (token, awbNumber) => {
//     console.log(awbNumber);

//     try {
//         const options = {
//             method: 'GET',
//             // Corrected the URL construction with proper template literals
//             url: `https://apigateway-sandbox.bluedart.com/in/transportation/tracking/v1/shipment?handler="tnt"&loginid=${process.env.BLUE_DART_LoginID}&numbers=${awbNumber}&format=xml&lickey=${process.env.BLUE_DART_LicenceKey}&action=custawbquery&verno=1&awb=awb`,
//             params: { scan: 1 },
//             headers: { 'JWTToken': token }
//         };

//         // Awaiting the axios request to ensure we handle the asynchronous operation correctly
//         const response = await axios.request(options);
//         console.log("Response:", response);
//         return response.data;

//     } catch (error) {
//         // Improved error handling with descriptive log
//         console.error("Error tracking order:", error);
//         throw error; // Re-throwing the error for further handling if necessary
//     }
// };








