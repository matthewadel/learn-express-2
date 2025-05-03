import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { allowedTo, validateRequestSchema, verifyToken } from "../middlewares";
import { orderSchema } from "../schemas/order.schema";
import { UserRoles } from "../models";

const router = Router();
const orderController = new OrderController();

router
  .route("/")
  .get(verifyToken, allowedTo([UserRoles.ADMIN]), orderController.getOrders)
  .post(
    verifyToken,
    validateRequestSchema(orderSchema.createOrder),
    orderController.createOrder
  );

router.get("/my-orders", verifyToken, orderController.getMyOrders);
router.get("/:orderId", verifyToken, orderController.getOrderById);

export default router;
