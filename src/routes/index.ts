import { Router } from "express";
import categoriesRouter from "./categories.route";
import subCategoriesRouter from "./subCategories.route";

const router = Router();

router.use("/category", categoriesRouter);
router.use("/sub-category", subCategoriesRouter);

export default router;
