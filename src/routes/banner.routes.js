import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  DeleteBanner,
  createBanner,
  getAdminBanner,
  getBanner,
} from "../controller/Banner.controller.js";
import { AdminAuthontication } from "../middleware/Admin.middleware.js";

const router = Router();

router
  .route("/create")
  .post(AdminAuthontication, upload.single("image"), createBanner);
router.route("/get").get(getBanner);
router.route("/get-admin").get(AdminAuthontication, getAdminBanner);
router.route("/delete/:id").delete(AdminAuthontication, DeleteBanner);

export default router;
