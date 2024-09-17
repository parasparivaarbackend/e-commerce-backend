import { Router } from "express";
import {
  AdminGetProductDetails,
  CreateProductDetails,
  DeleteProductDetails,
  UpdateProductDetails,
} from "../controller/productDetail.controller.js";
import { ProductDetailvalidation } from "../helper/index.helper.js";
import { upload } from "../middleware/multer.middleware.js";
import { AdminAuthontication } from "../middleware/Admin.middleware.js";

const router = Router();

router
  .route("/create")
  .post(
    AdminAuthontication,
    upload.array("image"),
    ProductDetailvalidation,
    CreateProductDetails
  );
router.route("/admin-get?").get(AdminAuthontication, AdminGetProductDetails);
router.route("/delete/:id").delete(AdminAuthontication, DeleteProductDetails);
router
  .route("/update/:id")
  .put(
    AdminAuthontication,
    ProductDetailvalidation,
    UpdateProductDetails
  );
// router.route("")

export default router;
