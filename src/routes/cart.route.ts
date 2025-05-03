import { Router } from "express";
import { CartController } from "../controllers";
import { validateRequestSchema, verifyToken } from "../middlewares";
import { cartSchema } from "../schemas";

const router = Router();
const cartController = new CartController();

router.post(
  "/",
  verifyToken,
  validateRequestSchema(cartSchema.addToCart),
  cartController.addToCart
);

router
  .route("/my-cart")
  .get(verifyToken, cartController.getMyCart)
  .delete(verifyToken, cartController.emptyMyCart);

router.get("/my-cart/products", verifyToken, cartController.getMyCartProducts);

router.post("/my-cart/applyCoupon", verifyToken, cartController.applyCoupon);

router
  .route("/my-cart/products/:productId")
  .put(
    verifyToken,
    validateRequestSchema(cartSchema.updateCart),
    cartController.updateProductInCart
  )
  .delete(verifyToken, cartController.deleteProductFromCart);

export default router;
