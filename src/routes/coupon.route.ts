import express from "express";
import { CouponsController } from "../controllers/coupon.controller";
import { allowedTo, validateRequestSchema, verifyToken } from "../middlewares";
import { couponSchema } from "../schemas";
import { UserRoles } from "../models";

const router = express.Router();
const couponsController = new CouponsController();

router
  .route("/")
  .post(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    validateRequestSchema(couponSchema.createCoupon),
    couponsController.createCoupon
  )
  .get(couponsController.getAllCoupons);

router
  .route("/:couponId")
  .get(couponsController.getCouponById)
  .put(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    validateRequestSchema(couponSchema.updateCoupon),
    couponsController.updateCoupon
  )
  .delete(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    couponsController.deleteCoupon
  );

export default router;
