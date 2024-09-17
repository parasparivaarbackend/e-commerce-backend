import { ConnectToDB } from "./config/DB.config.js";
import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config();

ConnectToDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`server is up and running on Port : ${process.env.PORT}`);
  });
});
