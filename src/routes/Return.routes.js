import { Router } from "express";
import { Authontication } from "../middleware/Auth.middleware.js";
import { Create, Getdata, Update } from "../controller/return.controller.js";
import { AdminAuthontication } from "../middleware/Admin.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { ReturnDetailvalidation } from "../helper/index.helper.js";

const router = Router();

router
  .route("/create")
  .post(Authontication, upload.array("image"), ReturnDetailvalidation, Create);
router.route("/get-return-order?").get(AdminAuthontication, Getdata);
router.route("/update-return/:id").patch(AdminAuthontication, Update);

export default router;
