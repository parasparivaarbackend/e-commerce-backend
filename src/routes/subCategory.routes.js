import { Router } from "express";
import {
  DeleteSubCategory,
  UpdateSubCategory,
  createSubCategory,
  getSubCategory,
} from "../controller/sub_category.controller.js";
import { Sub_category } from "../helper/index.helper.js";
import { AdminAuthontication } from "../middleware/Admin.middleware.js";

const router = Router();

router
  .route("/create")
  .post(AdminAuthontication, Sub_category, createSubCategory);
router.route("/get?").get(AdminAuthontication, getSubCategory);
router.route("/delete/:id").delete(AdminAuthontication, DeleteSubCategory);
router
  .route("/update/:id")
  .put(AdminAuthontication, Sub_category, UpdateSubCategory);

export default router;
