import { Router } from "express";
import {
  CreateCategory,
  DeleteCategory,
  GetCategory,
  GetCategorys,
  UpdateCategory,
} from "../controller/Category.controller.js";
import {
  multerErrorMiddleware,
  upload,
} from "../middleware/multer.middleware.js";
import { AdminAuthontication } from "../middleware/Admin.middleware.js";

const router = Router();

router
  .route("/create")
  .post(
    AdminAuthontication,
    upload.single("image"),
    multerErrorMiddleware,
    CreateCategory
  );
router.route("/get-admin?").get(AdminAuthontication, GetCategory);
router.route("/delete/:id").delete(AdminAuthontication, DeleteCategory);
router
  .route("/update/:id")
  .put(AdminAuthontication, upload.single("image"), UpdateCategory);
router.route("/category").get(GetCategorys);

export default router;
