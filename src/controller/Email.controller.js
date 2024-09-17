import { RecivedMail, SendMail } from "../utils/EmailHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const RecivedEmail = asyncHandler(async(req,res)=>{
    const data = req.body
    await RecivedMail(data)
    return res.status(200).json({
        message:"E-mail send successfull"
    })
})

export const SendEmail = asyncHandler(async(req,res)=>{
    const data = req.body
    await SendMail(data)
    return res.status(200).json({
        message:"E-mail send Successful"
    })
})