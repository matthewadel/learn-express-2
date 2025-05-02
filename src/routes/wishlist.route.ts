import { Router } from "express";
import { validateRequestSchema } from "../middlewares";
import { wishlistSchema } from "../schemas";
import { verifyToken } from "../middlewares";
import { allowedTo } from "../middlewares";
import { UserRoles } from "../models";
import { WishlistController } from "../controllers";

const router = Router();
const wishlistController = new WishlistController();

router
  .route("/")
  .get(
    verifyToken,
    allowedTo([UserRoles.USER]),
    wishlistController.getWishlistOfUser
  )
  .post(
    verifyToken,
    allowedTo([UserRoles.USER]),
    validateRequestSchema(wishlistSchema.addToWishlist),
    wishlistController.addToWishlist
  );

router
  .route("/:productId")
  .delete(
    verifyToken,
    allowedTo([UserRoles.USER]),
    wishlistController.deleteFromWishlist
  );

export default router;
