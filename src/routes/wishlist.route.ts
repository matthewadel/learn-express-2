import { Router } from "express";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";
import { wishlistSchema } from "../schemas";
import { verifyToken } from "../middlewares/verifyToken";
import { allowedTo } from "../middlewares/allowedTo";
import { UserRoles } from "../models/entities/user.entity";
import { WishlistController } from "../controllers/wishlist.controller";

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
