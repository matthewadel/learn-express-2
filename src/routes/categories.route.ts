import { Router } from "express";
import { CategoriesController } from "../controllers/categories.controller";
import { categoriesSchema } from "../schemas/categories.schema";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";

const router = Router();
const categoriesController = new CategoriesController();

router
  .route("/")
  .get(categoriesController.getAllCategories)
  .post(
    validateRequestSchema(categoriesSchema.createCategory),
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
