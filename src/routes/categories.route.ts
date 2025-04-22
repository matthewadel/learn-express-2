import { Router } from "express";
import { CategoriesController } from "../controllers/categories.controller";
import { categoriesSchema } from "../schemas/categories.schema";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";
import { uploadCategoryImage } from "../services";

const router = Router();
const categoriesController = new CategoriesController();

router
  .route("/")
  .get(
    validateRequestSchema(categoriesSchema.getAllCategories),
    categoriesController.getAllCategories
  )
  .post(
    // validateRequestSchema(categoriesSchema.createCategory),
    uploadCategoryImage, // Ensure the image is uploaded before validation
    categoriesController.createCategory
  );

router
  .route("/:categoryId")
  .get(categoriesController.getCategoryById)
  .put(
    validateRequestSchema(categoriesSchema.updateCategory),
    categoriesController.updateCategory
  )
  .delete(categoriesController.deleteCategory);

router
  .route("/:categoryId/sub-categories")
  .get(categoriesController.getSubCategoriesInsideCategory);

export default router;
