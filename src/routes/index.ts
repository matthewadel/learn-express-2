import { Router } from "express";
import categoriesRouter from "./categories.route";
import subCategoriesRouter from "./subCategories.route";
import brandsRouter from "./brands.route";
import productsRouter from "./product.route";
import colorsRouter from "./colors.route";
import UsersRouter from "./users.route";

const router = Router();

router.use("/category", categoriesRouter);
router.use("/sub-category", subCategoriesRouter);
router.use("/brand", brandsRouter);
router.use("/product", productsRouter);
router.use("/color", colorsRouter);
router.use("/user", UsersRouter);

export default router;
