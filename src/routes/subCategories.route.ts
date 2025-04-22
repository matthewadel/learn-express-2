import { subCategoriesSchema } from "./../schemas/subCategories.schema";
import { Router } from "express";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";
import { SubCategoryController } from "../controllers/subCategories.controller";

const router = Router();
const subcategoriesController = new SubCategoryController();

router
  .route("/")
  .get(
    validateRequestSchema(subCategoriesSchema.getAllSubCategories),
    subcategoriesController.getAllSubCategories
  )
  .post(
    validateRequestSchema(subCategoriesSchema.createSubCategory),
    subcategoriesController.createSubCategory
  );

router
  .route("/:subCategoryId")
  .get(subcategoriesController.getSubCategoryBy)
  .put(
    validateRequestSchema(subCategoriesSchema.updateSubCategory),
    subcategoriesController.updateSubCategory
  )
  .delete(subcategoriesController.deleteSubCategory);

export default router;
