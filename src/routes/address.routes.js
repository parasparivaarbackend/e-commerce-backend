import { Router } from "express";
import { Authontication } from "../middleware/Auth.middleware.js";
import {
  addAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} from "../controller/address.controller.js";
import { userAddress } from "../helper/index.helper.js";

const router = Router();

router.route("/add").post(Authontication, userAddress, addAddress);
router.route("/get").get(Authontication, getAddress);
router.route("/update/:id").put(Authontication, userAddress, updateAddress);
router.route("/delete/:id").delete(Authontication, deleteAddress);

export default router;
