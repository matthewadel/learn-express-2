import { Router } from "express";
import categoriesRouter from "./categories.route";
import subCategoriesRouter from "./subCategories.route";
import brandsRouter from "./brands.route";
import productsRouter from "./product.route";
import colorsRouter from "./colors.route";
import UsersRouter from "./users.route";
import AuthRouter from "./auth.route";
import ReviewRouter from "./review.route";
import WishlistRouter from "./wishlist.route";
import AddresstRouter from "./address.route";
import CityRouter from "./city.route";
import CouponRouter from "./coupon.route";
import CartRouter from "./cart.route";

const router = Router();

router.use("/category", categoriesRouter);
router.use("/sub-category", subCategoriesRouter);
router.use("/brand", brandsRouter);
router.use("/product", productsRouter);
router.use("/color", colorsRouter);
router.use("/user", UsersRouter);
router.use("/auth", AuthRouter);
router.use("/review", ReviewRouter);
router.use("/wishlist", WishlistRouter);
router.use("/address", AddresstRouter);
router.use("/city", CityRouter);
router.use("/coupon", CouponRouter);
router.use("/cart", CartRouter);

export default router;
