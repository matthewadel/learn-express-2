import { Router } from "express";
import categoriesRouter from "./categories.route";
import subCategoriesRouter from "./subCategories.route";
import bbrandsRouter from "./brands.route";

const router = Router();

router.use("/category", categoriesRouter);
router.use("/sub-category", subCategoriesRouter);
router.use("/brand", bbrandsRouter);

export default router;
