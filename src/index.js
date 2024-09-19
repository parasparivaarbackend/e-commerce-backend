import { ConnectToDB } from "./config/DB.config.js";
import { app } from "./app.js";
import dotenv from "dotenv";
import { SendMailTemplate } from "./utils/EmailHandler.js";
dotenv.config();

ConnectToDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`server is up and running on Port : ${process.env.PORT}`);
  });
});

const item = { email: "parasjisco@gmail.com", Sub: "new product" };
const template = {
  url: "newProduct.ejs",
  image:
    "https://www.jiomart.com/images/product/original/rvag2mtrld/buynewtrend-solid-navy-rayon-half-sleeve-women-formal-shirt-product-images-rvag2mtrld-0-202303221125.jpg?im=Resize=(500,630)",
  productTitle: "product 1",
  productSubtitle: "subtitle 1",
};
// SendMailTemplate(item, template);
