import { Router } from "express";
import { CategoriesController } from "../controllers/categories.controller";
import { categoriesSchema } from "../schemas/categories.schema";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";
import {
  compressImage,
  uploadSingleImage
} from "../middlewares/uploadSingleImage";

const router = Router();
const categoriesController = new CategoriesController();

router
  .route("/")
  .get(
    validateRequestSchema(categoriesSchema.getAllCategories),
    categoriesController.getAllCategories
  )
  .post(
    uploadSingleImage("image"),
    compressImage("category", "categories"),
    validateRequestSchema(categoriesSchema.createCategory),
    categoriesController.createCategory
  );

router
  .route("/:categoryId")
  .get(categoriesController.getCategoryById)
  .put(
    uploadSingleImage("image"),
    compressImage("category", "categories"),
    validateRequestSchema(categoriesSchema.updateCategory),
    categoriesController.updateCategory
  )
  .delete(categoriesController.deleteCategory);

router
  .route("/:categoryId/sub-categories")
  .get(categoriesController.getSubCategoriesInsideCategory);

export default router;
