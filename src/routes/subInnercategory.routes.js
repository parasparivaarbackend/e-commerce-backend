import { Router } from "express";
import {
  Createinnercategory,
  DeleteInnerCategory,
  GetInnerCategory,
  UpdateInnerCategory,
} from "../controller/Sub_inner_category.js";

import { Sub_Inner_category } from "../helper/index.helper.js";
import { AdminAuthontication } from "../middleware/Admin.middleware.js";

const router = Router();

router
  .route("/create")
  .post(AdminAuthontication, Sub_Inner_category, Createinnercategory);
router.route("/get-admin?").get(AdminAuthontication, GetInnerCategory);
router.route("/delete/:id").delete(AdminAuthontication, DeleteInnerCategory);
router
  .route("/update/:id")
  .put(AdminAuthontication, Sub_Inner_category, UpdateInnerCategory);

export default router;
