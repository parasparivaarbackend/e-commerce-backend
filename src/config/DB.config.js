import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


export const ConnectToDB = async( ) => {
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI,{  
            dbName:"e-commerce",
        })
        console.log("database is connected")
    }catch(err){
        console.log("mongodb not Connected: ",err)
    }
}