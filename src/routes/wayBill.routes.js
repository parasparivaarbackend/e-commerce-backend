import { Router } from "express";
import { CancelPickup, createWaybill, TrackingShipment } from "../controller/waybill.controller.js";
import { Authontication } from "../middleware/Auth.middleware.js";

const router = Router()


router.route("/create").post(Authontication, createWaybill)
router.route("/cancel").post(Authontication, CancelPickup)
router.route("/TrackingShipment").post(Authontication,TrackingShipment)



export default router