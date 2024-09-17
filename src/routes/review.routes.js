import { Router } from "express";
import { Authontication } from "../middleware/Auth.middleware.js";
import {
  CreateReview,
  DeleteReview,
  GetReview,
} from "../controller/Review.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/add")
  .post(Authontication, upload.array("image", 3), CreateReview);
router.route("/delete/:id").delete(Authontication, DeleteReview);
router.route("/get").get(Authontication, GetReview);

export default router;
