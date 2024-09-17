import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// export const GenerateToken = async () => {
//     try {
//         const options = {
//             method: 'GET',
//             url: 'https://apigateway-sandbox.bluedart.com/in/transportation/token/v1/login',
//             headers: { ClientID: process.env.BLUE_DART_CLIENT_ID, clientSecret: process.env.BLUE_DART_CLIENT_SECRET }
//         };

//         const res = await axios.request(options)
//         return res?.data?.JWTToken
//     } catch (error) {
//         console.log(error)
//     }
// }
// var axios = require("axios").default;


export async function GenerateToken() {
    try {

        var options = {
            method: 'GET',
            url: 'https://apigateway-sandbox.bluedart.com/in/transportation/token/v1/login',
            headers: { ClientID: process.env.BLUE_DART_CLIENT_ID, clientSecret: process.env.BLUE_DART_CLIENT_SECRET }
        };

        const response = await axios.request(options);
        return response.data?.JWTToken;

    } catch (error) {
        console.log(error)
    }
}
