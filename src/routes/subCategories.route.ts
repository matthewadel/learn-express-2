import { Router } from "express";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";
import { SubCategoryController } from "../controllers/subCategories.controller";
import { subCategoriesSchema } from "../schemas/subCategories.schema";

const router = Router();
const subcategoriesController = new SubCategoryController();

router
  .route("/")
  .get(subcategoriesController.getAllSubCategories)
  .post(
    validateRequestSchema(subCategoriesSchema.createSubCategory),
    subcategoriesController.createSubCategory
  );

router
  .route("/:subCategoryId")
  .get(subcategoriesController.getSubCategoryById)
  .put(
    validateRequestSchema(subCategoriesSchema.updateSubCategory),
    subcategoriesController.updateSubCategory
  )
  .delete(subcategoriesController.deleteSubCategory);

export default router;
