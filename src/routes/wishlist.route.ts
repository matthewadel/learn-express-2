import { Router } from "express";
import { validateRequestSchema } from "../middlewares";
import { wishlistSchema } from "../schemas";
import { verifyToken } from "../middlewares";
import { WishlistController } from "../controllers";

const router = Router();
const wishlistController = new WishlistController();

router
  .route("/")
  .get(verifyToken, wishlistController.getWishlistOfUser)
  .post(
    verifyToken,
    validateRequestSchema(wishlistSchema.addToWishlist),
    wishlistController.addToWishlist
  );

router
  .route("/:productId")
  .delete(verifyToken, wishlistController.deleteFromWishlist);

export default router;
